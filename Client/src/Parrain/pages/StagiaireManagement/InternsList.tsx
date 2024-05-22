import React, { useCallback, useEffect, useMemo, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {GET_ALL_INTERN, DELETE_INTERN, UPDATE_INTERN, CREATE_INTERN} from "services/internsAPIs/internsAPIs"
import {DELETE_TASKS_OF_INTERN} from "services/tasksAPIs/tasksAPIs"

import { storage } from "helpers/firebaseConfig";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  UploadTaskSnapshot,
} from "firebase/storage";

// Icons
import { Search, Plus, Trash2, Eye, Pencil, ImagePlus, Import } from "lucide-react";

import dummyImg from "assets/images/users/user-dummy-img.jpg";

import TableContainer from "Common/TableContainer";
import { Link } from "react-router-dom";

import DeleteModal from "Common/DeleteModal";
import Modal from "Common/Components/Modal";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer } from "react-toastify";

import getToken from "helpers/jwt-token-access/tokenAccess";

const EmployeeList = () => {
  const [eventData, setEventData] = useState<any>();

  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // Image
  const [selectedImage, setSelectedImage] = useState<any>();
  const [imageFile, setImageFile] = useState<File>();
  const [imageChanged, setImageChanged] = useState<boolean>();

  const handleImageChange = (event: any) => {
    setImageChanged(true);
    console.log("image changed");
    console.log(imageChanged);
    const fileInput = event.target;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        setSelectedImage(e.target.result);
        setImageFile(file);
        console.log("file :");
        console.log(file);
      };

      reader.readAsDataURL(file);
    }
  };

  const [isinProgress, setIsinProgress] = useState<Boolean>(false);

  const uploadFileToFirebase = async (updatedFile: String) => {
    console.log("uploading file");
    console.log(updatedFile);

    if (imageFile) {
      const storageRef = ref(storage, `image/${updatedFile}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      try {
        const snapshot: UploadTaskSnapshot = await new Promise(
          (resolve, reject) => {
            const unsubscribe = uploadTask.on(
              "state_changed",
              (snapshot) => {
                // Progress updates can be handled here if needed
                setIsinProgress(true);
              },
              (error) => {
                unsubscribe();
                reject(error);
              },
              () => {
                unsubscribe();
                resolve(uploadTask.snapshot);
              }
            );
          }
        );

        console.log("Upload is complete");
        const downloadURL = await getDownloadURL(storageRef);
        console.log("File available at", downloadURL);
        setIsinProgress(false);
        return downloadURL;
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      console.log("File not found");
    }
  };

  // function to get an image by userId here:
  const getImageByUserId = (userId: string): Promise<string> => {
    const storageRef = ref(storage, `image/${userId}`);
    return getDownloadURL(storageRef)
      .then((url) => {
        return url;
      })
      .catch((error) => {
        console.log(error.message);
        return "";
      });
  };

  //function to delete an image by userId here:
  const deleteImageByUserId = (userId: string): Promise<void> => {
    const storageRef = ref(storage, `image/${userId}`);
    return deleteObject(storageRef)
      .then(() => {
        console.log("Image deleted successfully");
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  const formatDueDate = (dueDateStr: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const dueDate = new Date(dueDateStr);
    return dueDate.toLocaleDateString("en-GB", options); // Adjust locale as needed
  };

  // get the interns data from api
  const [interns, setInterns] = useState([]);
  const [imageUrls, setImageUrls] = useState<{ [userId: string]: string }>({});
  const [parrainId, setParrianId] = useState("");

  const fetchInternsData = async () => {
    try {
      const response = await fetch(
        `${GET_ALL_INTERN+parrainId}`,
        {
          headers: {
            authorization: `Bearer ${getToken()}`, // Include the token in the Authorization header
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setInterns(data);
      console.log(data);
      // Fetch image URLs for each intern
      const fetchImageUrls = async () => {
        const urls: { [userId: string]: string } = {};
        for (const intern of data) {
          const userId = intern.internId;
          const imageUrl = await getImageByUserId(userId);
          urls[userId] = imageUrl || "";
        }
        setImageUrls(urls);
      };
      fetchImageUrls();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const authUser = localStorage.getItem("authUser");
    if (authUser) {
      const authUserData = JSON.parse(authUser);
      setParrianId(authUserData.parrainId);
    } else {
      console.log("authUser not found in localStorage");
    }

    fetchInternsData(); // Fetch data when component mounts
  }, [parrainId]);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = () => setDeleteModal(!deleteModal);

  // DELETE INTERN

  const deleteInternById = async (internId: string) => {
    try {
      const response = await fetch(
        `${DELETE_INTERN+internId}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${getToken()}`, // Include the token in the Authorization header
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete intern");
      }

      toast.success("Intern deleted successfully", { autoClose: 2000 });
      deleteImageByUserId(internId);

      // You can trigger a data refresh here if needed

      await fetchInternsData();
    } catch (error) {
      console.error("Error deleting intern:", error);
      toast.error("Error deleting intern", { autoClose: 2000 });
    }
  };

  const deleteTasksByInternId = async (internId: string) => {
    try {
      const response = await fetch(
        `${DELETE_TASKS_OF_INTERN+internId}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${getToken()}`, // Include the token in the Authorization header
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete tasks");
      }
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  // Delete Data
  const onClickDelete = (cell: any) => {
    setDeleteModal(true);
    if (cell.internId) {
      setEventData(cell);
    }
  };

  const handleDelete = () => {
    if (eventData) {
      deleteInternById(eventData.internId);
      deleteTasksByInternId(eventData.internId);
      setDeleteModal(false);
    }
  };
  //

  // Update Data
  const handleUpdateDataClick = (ele: any) => {
    setEventData({ ...ele });

    setIsEdit(true);
    setShow(true);
  };

  const updateInternById = (
    internId: string,
    updatedData: any
  ): Promise<any> => {
    return fetch(`${UPDATE_INTERN+internId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          toast.error("Error updating intern", { autoClose: 2000 });
        }
        toast.success("Intern updated successfully", { autoClose: 2000 });

        setInterval(async () => {
          await fetchInternsData();
        }, 3000);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  // validation
  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      internId: (eventData && eventData.internId) || "",
      fname: (eventData && eventData.fname) || "",
      lname: (eventData && eventData.lname) || "",
      img: (eventData && eventData.img) || "",
      email: (eventData && eventData.email) || "",
      speciality: eventData && eventData.speciality,
      service: eventData && eventData.service,
      password: (eventData && eventData.password) || "",
      phone: (eventData && eventData.phone) || "",
      etablissement: (eventData && eventData.etablissement) || "",
      age: (eventData && eventData.age) || "",
      StageDuration: (eventData && eventData.StageDuration) || "",
      joinDate: (eventData && eventData.joinDate) || "",
      EndDate: (eventData && eventData.EndDate) || "",
    },
    validationSchema: Yup.object({
      internId: Yup.string().required("Please Enter Intern ID"),
      fname: Yup.string().required("Please Enter Fisrt Name"),
      lname: Yup.string().required("Please Enter Last Name"),

      etablissement: Yup.string().required("Please Enter Etablissement"),
      email: Yup.string().required("Please Enter Email"),
      password: Yup.string().required("Please Enter Password"),
      phone: Yup.string().required("Please Enter Phone"),
      speciality: Yup.string().required("Please Enter Speciality"),
      service: Yup.string().required("Please Enter Service"),
      age: Yup.string().required("Please Enter Age"),
      StageDuration: Yup.string().required("Please Enter Stage Duration"),
      joinDate: Yup.string().required("Please Enter Date"),
      EndDate: Yup.string().required("Please Enter Date"),
    }),

    onSubmit: async (values) => {
      // console.log(values);
      if (isEdit) {
        console.log("editing data");

        let updateData;

        if (imageChanged) {
          console.log("imageChanged");
          console.log(imageChanged);
          let updatedimg = await uploadFileToFirebase(values.internId);
          if (updatedimg == null) {
            updatedimg = "";
          }

          updateData = {
            ...values,
            id: eventData ? eventData.id : 0,
            img: updatedimg,
          };
        } else {
          updateData = {
            ...values,
            id: eventData ? eventData.id : 0,
          };
        }

        // update user
        updateInternById(updateData.internId, updateData);
      } else {
        let img = await uploadFileToFirebase(values.internId);
        if (img == null) {
          img = "";
        }
        console.log("adding data");

        const newData = {
          ...values,
          StageDuration: values.StageDuration + " Jour",
          parrainId: parrainId,
          img: img,
        };

        console.log(newData);
        // save new intern
        try {
          const response = await fetch(`${CREATE_INTERN}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(newData),
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();

          // handle successful response
          toast.success("Intern Added Successfully", { autoClose: 3000 });

          setInterval(async () => {
            await fetchInternsData();
          }, 3000);
        } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
          toast.error("Intern Added Failed", { autoClose: 2000 });
          // handle error
        }
      }
      toggle();
    },
  });

  //
  const toggle = useCallback(() => {
    if (show) {
      setShow(false);
      setEventData("");
      setIsEdit(false);
      setSelectedImage("");
    } else {
      setShow(true);
      setEventData("");
      setSelectedImage("");
      validation.resetForm();
    }
  }, [show, validation]);

  // columns
  const columns = useMemo(
    () => [
      {
        header: "intern ID",
        accessorKey: "internId",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <Link
            to="#!"
            className="transition-all duration-150 ease-linear text-custom-500 hover:text-custom-600"
          >
            {cell.getValue()}
          </Link>
        ),
      },
      {
        header: "First Name",
        accessorKey: "fname",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const userId = cell.row.original.internId;
          const imageUrl = imageUrls[userId] || ""; // Get the image URL from state
          return (
            <Link to="#!" className="flex items-center gap-3">
              <div className="size-6 rounded-full shrink-0 bg-slate-100">
                <img
                  src={imageUrl || cell.row.original.img}
                  alt=""
                  className="h-6 rounded-full"
                />
              </div>
              <h6 className="grow">{cell.getValue()}</h6>
            </Link>
          );
        },
      },

      {
        header: "Last Name",
        accessorKey: "lname",
        enableColumnFilter: false,
      },
      {
        header: "Age",
        accessorKey: "age",
        enableColumnFilter: false,
      },
      {
        header: "Etablissement",
        accessorKey: "etablissement",
        enableColumnFilter: false,
      },

      {
        header: "Stage Duration",
        accessorKey: "StageDuration",
        enableColumnFilter: false,
      },

      {
        header: "Joining Date",
        accessorKey: "joinDate",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <h6 className="text-slate-600 dark:text-zink-100">
            {formatDueDate(cell.getValue())}
          </h6>
        ),
      },

      {
        header: "End Date",
        accessorKey: "EndDate",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <h6 className="text-slate-600 dark:text-zink-100">
            {formatDueDate(cell.getValue())}
          </h6>
        ),
      },

      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => (
          <div className="flex gap-3">
            <Link
              className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
              to={`/pages-account?internId=${cell.row.original.internId}`}
            >
              <Eye className="inline-block size-3" />{" "}
            </Link>
            <Link
              to="#!"
              data-modal-target="addEmployeeModal"
              className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md edit-item-btn bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
              onClick={() => {
                const data = cell.row.original;
                data.img = imageUrls[cell.row.original.internId];
                handleUpdateDataClick(data);
              }}
            >
              <Pencil className="size-4" />
            </Link>
            <Link
              to="#!"
              className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md remove-item-btn bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
              onClick={() => {
                const data = cell.row.original;
                onClickDelete(data);
              }}
            >
              <Trash2 className="size-4" />
            </Link>
          </div>
        ),
      },
    ],
    [imageUrls]
  );

  return (
    <React.Fragment>
      <BreadCrumb title="Interns List" pageTitle="HR Management" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />
      <div className="card" id="employeeTable">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <h6 className="text-15 grow">
              Interns (<b className="total-Employs">{interns.length}</b>)
            </h6>
            <div className="shrink-0">
              <Link
                to="#!"
                data-modal-target="addEmployeeModal"
                type="button"
                className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20 add-employee"
                onClick={toggle}
              >
                <Plus className="inline-block size-4" />{" "}
                <span className="align-middle">Add Intern</span>
              </Link>
            </div>
          </div>

          {/* Displaying the data */}

          {interns && interns.length > 0 ? (
            <TableContainer
              isPagination={true}
              columns={columns || []}
              data={interns || []}
              customPageSize={7}
              divclassName="-mx-5 overflow-x-auto"
              tableclassName="w-full whitespace-nowrap"
              theadclassName="ltr:text-left rtl:text-right bg-slate-100 dark:bg-zink-600"
              thclassName="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500"
              tdclassName="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500"
              PaginationClassName="flex flex-col items-center gap-4 px-4 mt-4 md:flex-row"
            />
          ) : (
            <div className="noresult">
              <div className="py-6 text-center">
                <Search className="size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20" />
                <h5 className="mt-2 mb-1">Sorry! No Result Found</h5>
                <p className="mb-0 text-slate-500 dark:text-zink-200">
                  We've searched more than 299+ Employee We did not find any
                  Employee for you search.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Employee Modal */}
      <Modal
        show={show}
        onHide={toggle}
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600"
      >
        <Modal.Header
          className="flex items-center justify-between p-4 border-b dark:border-zink-500"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
        >
          <Modal.Title className="text-16">
            {!!isEdit ? "Edit Intern" : "Add Intern"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
          {/* Add a new intern */}
          <form
            className="create-form"
            id="create-form"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <input type="hidden" value="" name="id" id="id" />
            <input type="hidden" value="add" name="action" id="action" />
            <input type="hidden" id="id-field" />
            <div
              id="alert-error-msg"
              className="hidden px-4 py-3 text-sm text-red-500 border border-transparent rounded-md bg-red-50 dark:bg-red-500/20"
            ></div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              {/* image upload */}
              <div className="xl:col-span-12">
                <div className="relative size-24 mx-auto mb-4 rounded-full shadow-md bg-slate-100 profile-user dark:bg-zink-500">
                  <img
                    src={selectedImage || validation.values.img || dummyImg}
                    alt=""
                    className="object-cover w-full h-full rounded-full user-profile-image"
                  />
                  <div className="absolute bottom-0 flex items-center justify-center size-8 rounded-full ltr:right-0 rtl:left-0 profile-photo-edit">
                    <input
                      id="profile-img-file-input"
                      name="profile-img-file-input"
                      type="file"
                      accept="image/*"
                      className="hidden profile-img-file-input"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="profile-img-file-input"
                      className="flex items-center justify-center size-8 bg-white rounded-full shadow-lg cursor-pointer dark:bg-zink-600 profile-photo-edit"
                    >
                      <ImagePlus className="size-4 text-slate-500 fill-slate-200 dark:text-zink-200 dark:fill-zink-500" />
                    </label>
                  </div>
                </div>
                {validation.touched.img && validation.errors.img ? (
                  <p className="text-red-400">{validation.errors.img}</p>
                ) : null}
              </div>

              <div className="xl:col-span-12">
                <label
                  htmlFor="internId"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Intern CIN
                </label>
                <input
                  type="text"
                  id="internId"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="M56356"
                  name="internId"
                  onChange={validation.handleChange}
                  value={validation.values.internId || ""}
                  {...(!!isEdit ? { disabled: true } : {})}
                />
                {validation.touched.internId && validation.errors.internId ? (
                  <p className="text-red-400">{validation.errors.internId}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="fname"
                  className="inline-block mb-2 text-base font-medium"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="fname"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Intern fisrt name"
                  name="fname"
                  onChange={validation.handleChange}
                  value={validation.values.fname || ""}
                />
                {validation.touched.fname && validation.errors.fname ? (
                  <p className="text-red-400">{validation.errors.fname}</p>
                ) : null}
              </div>

              <div className="xl:col-span-12">
                <label
                  htmlFor="lname"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lname"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Intern last name"
                  name="lname"
                  onChange={validation.handleChange}
                  value={validation.values.lname || ""}
                />
                {validation.touched.lname && validation.errors.lname ? (
                  <p className="text-red-400">{validation.errors.lname}</p>
                ) : null}
              </div>

              <div className="xl:col-span-12">
                <label
                  htmlFor="email"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="example@gmail.com"
                  name="email"
                  onChange={validation.handleChange}
                  value={validation.values.email || ""}
                />
                {validation.touched.email && validation.errors.email ? (
                  <p className="text-red-400">{validation.errors.email}</p>
                ) : null}
              </div>

              <div className="xl:col-span-12">
                <label
                  htmlFor="password"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Password
                </label>
                <input
                  type="text"
                  id="password"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="*****"
                  name="password"
                  onChange={validation.handleChange}
                  value={validation.values.password || ""}
                />
                {validation.touched.password && validation.errors.password ? (
                  <p className="text-red-400">{validation.errors.password}</p>
                ) : null}
              </div>

              <div className="xl:col-span-6">
                <label
                  htmlFor="phone"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter phone number"
                  name="phone"
                  onChange={validation.handleChange}
                  value={validation.values.phone || ""}
                />
                {validation.touched.phone && validation.errors.phone ? (
                  <p className="text-red-400">{validation.errors.phone}</p>
                ) : null}
              </div>

              <div className="xl:col-span-6">
                <label
                  htmlFor="StageDuration"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Durée du stage
                </label>
                <input
                  type="text"
                  id="StageDuration"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Durée (en jour)"
                  name="StageDuration"
                  onChange={validation.handleChange}
                  value={validation.values.StageDuration || ""}
                />
                {validation.touched.StageDuration &&
                validation.errors.StageDuration ? (
                  <p className="text-red-400">
                    {validation.errors.StageDuration}
                  </p>
                ) : null}
              </div>

              <div className="xl:col-span-6">
                <label
                  htmlFor="joinDate"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Joining Date
                </label>
                <Flatpickr
                  id="joinDate"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  options={{
                    dateFormat: "d M, Y",
                  }}
                  placeholder="Select date"
                  name="joinDate"
                  onChange={(date: any) =>
                    validation.setFieldValue(
                      "joinDate",
                      moment(date[0]).format("DD MMMM ,YYYY")
                    )
                  }
                  value={validation.values.joinDate || ""}
                />
                {validation.touched.joinDate && validation.errors.joinDate ? (
                  <p className="text-red-400">{validation.errors.joinDate}</p>
                ) : null}
              </div>

              <div className="xl:col-span-6">
                <label
                  htmlFor="EndDate"
                  className="inline-block mb-2 text-base font-medium"
                >
                  End Date
                </label>
                <Flatpickr
                  id="EndDate"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  options={{
                    dateFormat: "d M, Y",
                  }}
                  placeholder="Select date"
                  name="EndDate"
                  onChange={(date: any) =>
                    validation.setFieldValue(
                      "EndDate",
                      moment(date[0]).format("DD MMMM ,YYYY")
                    )
                  }
                  value={validation.values.EndDate || ""}
                />
                {validation.touched.EndDate && validation.errors.EndDate ? (
                  <p className="text-red-400">{validation.errors.EndDate}</p>
                ) : null}
              </div>

              <div className="xl:col-span-6">
                <label
                  htmlFor="age"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="22"
                  name="age"
                  onChange={validation.handleChange}
                  value={validation.values.age || ""}
                />
                {validation.touched.age && validation.errors.age ? (
                  <p className="text-red-400">{validation.errors.age}</p>
                ) : null}
              </div>

              <div className="xl:col-span-6">
                <label
                  htmlFor="etablissement"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Etablissement
                </label>
                <input
                  type="text"
                  id="etablissement"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="EST,FST.."
                  name="etablissement"
                  onChange={validation.handleChange}
                  value={validation.values.etablissement || ""}
                />
                {validation.touched.etablissement &&
                validation.errors.etablissement ? (
                  <p className="text-red-400">
                    {validation.errors.etablissement}
                  </p>
                ) : null}
              </div>

              <div className="xl:col-span-6">
                <label
                  htmlFor="service"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Service
                </label>
                <select
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  data-choices
                  data-choices-search-false
                  id="servicetInput"
                  name="service"
                  onChange={validation.handleChange}
                  value={validation.values.service || ""}
                >
                  <option value="SI">SI</option>
                  <option value="Achats">Achats</option>
                  <option value="Juridique">Juridique</option>
                  <option value="OIJ/M">OIJ/M</option>
                  <option value="OIJ/R">OIJ/R</option>
                  <option value="OIJ/A">OIJ/A</option>
                  <option value="OIJ/B">OIJ/B</option>
                </select>
                {validation.touched.service && validation.errors.service ? (
                  <p className="text-red-400">{validation.errors.service}</p>
                ) : null}
              </div>

              <div className="xl:col-span-6">
                <label
                  htmlFor="speciality"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Speciality
                </label>
                <select
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  data-choices
                  data-choices-search-false
                  id="typeSelect"
                  name="speciality"
                  onChange={validation.handleChange}
                  value={validation.values.speciality || ""}
                >
                  <option value="Informatique">Informatique</option>
                  <option value="Génie Civil">Génie Civil</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Phosphat">Phosphat</option>
                </select>
                {validation.touched.speciality &&
                validation.errors.speciality ? (
                  <p className="text-red-400">{validation.errors.speciality}</p>
                ) : null}
              </div>
            </div>

            <div className="mt-5 mb-2 flex justify-center items-center">
              {isinProgress ? (
                <div className="inline-block size-8 border-2 border-green-500 rounded-full animate-spin border-l-transparent"></div>
              ) : null}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="reset"
                id="close-modal"
                data-modal-close="addEmployeeModal"
                className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-600 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
                onClick={toggle}
              >
                Cancel
              </button>
              <button
                type="submit"
                id="addNew"
                className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
              >
                {!!isEdit ? "Update" : "Add Intern"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default EmployeeList;
