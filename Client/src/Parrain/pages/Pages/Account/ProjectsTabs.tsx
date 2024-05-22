import React, { useCallback, useEffect, useState } from "react";
import { Dropdown } from "Common/Components/Dropdown";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  FileEdit,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import Flatpickr from "react-flatpickr";
import Modal from "Common/Components/Modal";
import { toast } from "react-toastify";
import DeleteModal from "Common/DeleteModal";

// Image

import moment from "moment";
import { ToastContainer } from "react-toastify";


import getToken from "helpers/jwt-token-access/tokenAccess";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";


import {
  CREATE_TASK,
  DELETE_TASK_BY_ID,
  UPDATE_TASK_BY_ID,
  FETCH_TASKS,
} from "services/tasksAPIs/tasksAPIs";

interface ProjectItem {
  internId: string;
  title: string;
  description: string;
  dueDate: string;
  statut: string;
  completionPercentage: number;
}

const ProjectsTabs = (props: any) => {
  const [tasks, setTasks] = useState<any[]>([]);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = () => setDeleteModal(!deleteModal);

  const [taskId, setTaskid] = useState("");

  // Delete Data
  const onClickDelete = (taskId: any) => {
    console.log("task id");
    console.log(taskId);
    setDeleteModal(true);
    if (taskId) {
      setEventData(taskId);
      setTaskid(taskId);
    }
  };

  const handleDelete = () => {
    if (eventData) {
      deleteTaskById(taskId);
      setDeleteModal(false);
    }
  };

  const deleteTaskById = async (taskId: string) => {
    try {
      console.log("task id");
      console.log(taskId);
      const response = await fetch(`${DELETE_TASK_BY_ID + taskId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${getToken()}`, // Include the token in the Authorization header
        },
      });
      if (!response.ok) {
        toast.error("Error deleting Task", { autoClose: 2000 });
      }

      toast.success("Task deleted successfully", { autoClose: 2000 });

      // You can trigger a data refresh here if needed

      setInterval(async () => {
        await fetchTasksData();
        await props.getNumberOfTasksById(props.internId);
      }, 500);
    } catch (error) {
      console.error("Error deleting intern:", error);
      toast.error("Error deleting intern", { autoClose: 2000 });
    }
  };

  const fetchTasksData = async () => {
    try {
      const response = await fetch(`${FETCH_TASKS + props.internId}`, {
        headers: {
          authorization: `Bearer ${getToken()}`, // Include the token in the Authorization header
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      //   console.log(data.tasks[0].title);

      setTasks(data.tasks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, [props.internId]);

  const getStatusClass = (status: string): string => {
    switch (status) {
      case "todo":
        return "text-purple-500";
      case "enCours":
        return "text-orange-500";
      case "termine":
        return "text-green-500";
      default:
        return "text-black"; // Default color if status is unknown
    }
  };

  const dispatch = useDispatch<any>();

  const [eventData, setEventData] = useState<any>();

  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // validation
  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      title: (eventData && eventData.title) || "",
      description: (eventData && eventData.description) || "",
      dueDate: (eventData && eventData.dueDate) || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Title"),
      description: Yup.string().required("Please Enter Description"),
      dueDate: Yup.string().required("Please Enter Date"),
    }),

    onSubmit: async (values) => {
      if (isEdit) {
        const updateTask = {
          id: eventData ? eventData._id : 0,
          ...values,
        };

        // update task here
        dispatch(updateTaskById(updateTask.id, values));
      } else {
        const newData = {
          ...values,
          internId: props.internId,
        };
        console.log(newData);
        // save new user
        try {
          console.log("form data :");
          console.log(newData);
          const response = await fetch(`${CREATE_TASK}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${getToken()}`, // Include the token in the Authorization header
            },
            body: JSON.stringify(newData),
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log(data);
          // handle successful response
          toast.success("Task Added Successfully", { autoClose: 3000 });

          setInterval(async () => {
            await fetchTasksData();
            await props.getNumberOfTasksById(props.internId);
          }, 1000);
        } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
          toast.error("Task Added Failed", { autoClose: 2000 });
          // handle error
        }
        // dispatch(onAddNotes(newUser));
      }
      toggle();
    },
  });

  const updateTaskById = (taskId: string, updatedData: any): Promise<any> => {
    return fetch(`${UPDATE_TASK_BY_ID + taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getToken()}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          toast.error("Error updating task", { autoClose: 2000 });
        }
        toast.success("task updated successfully", { autoClose: 2000 });
        toggle();

        setInterval(async () => {
          await fetchTasksData();
        }, 500);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  // Update Data
  const handleUpdateDataClick = (ele: any) => {
    setEventData({ ...ele });

    setIsEdit(true);
    setShow(true);
  };

  const toggle = useCallback(() => {
    if (show) {
      setShow(false);
      setEventData("");
      setIsEdit(false);
    } else {
      setShow(true);
      setEventData("");
      validation.resetForm();
    }
  }, [show, validation]);

  const formatDueDate = (dueDateStr: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const dueDate = new Date(dueDateStr);
    return dueDate.toLocaleDateString("en-GB", options); // Adjust locale as needed
  };

  return (
    <React.Fragment>
      <ToastContainer closeButton={false} limit={1} />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <div className="flex items-center gap-3 mb-4">
        <h5 className="underline grow">Tasks</h5>
        <div className="shrink-0">
          <button
            type="button"
            className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
            onClick={toggle}
          >
            Add Task
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-5 md:grid-cols-2 2xl:grid-cols-4">
        {tasks &&
          tasks.map((task) => (
            <div key={task._id} className="card relative">
              <div className="card-body">
                <div className="flex justify-between">
                  <div className="absolute right-5">
                    <Dropdown className="relative">
                      <Dropdown.Trigger
                        className="flex items-center justify-center size-[37.5px] dropdown-toggle p-0 text-slate-500 btn bg-slate-200 border-slate-200 hover:text-slate-600 hover:bg-slate-300 hover:border-slate-300 focus:text-slate-600 focus:bg-slate-300 focus:border-slate-300 focus:ring focus:ring-slate-100 active:text-slate-600 active:bg-slate-300 active:border-slate-300 active:ring active:ring-slate-100 dark:bg-zink-600 dark:hover:bg-zink-500 dark:border-zink-600 dark:hover:border-zink-500 dark:text-zink-200 dark:ring-zink-400/50"
                        id={`projectDropdownmenu${task._id}`}
                        data-bs-toggle="dropdown"
                      >
                        <MoreHorizontal className="size-4"></MoreHorizontal>
                      </Dropdown.Trigger>
                      <Dropdown.Content
                        placement="right-end"
                        className="absolute z-50 py-2 mt-1 text-left list-none bg-white rounded-md shadow-md dropdown-menu min-w-[10rem]"
                        aria-labelledby={`projectDropdownmenu${task._id}`}
                      >
                        <li>
                          <a
                            className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear bg-white text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500"
                            href="#!"
                            onClick={() => {
                              handleUpdateDataClick(task);
                            }}
                          >
                            <FileEdit className="inline-block size-3 mr-1"></FileEdit>{" "}
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear bg-white text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500"
                            href="#!"
                            onClick={() => {
                              onClickDelete(task._id);
                            }}
                          >
                            <Trash2 className="inline-block size-3 mr-1"></Trash2>{" "}
                            Delete
                          </a>
                        </li>
                      </Dropdown.Content>
                    </Dropdown>
                  </div>
                </div>

                <div className="mt-4">
                  <h6 className="mb-1 text-16">
                    <a href="#!">{task.title}</a>
                  </h6>
                  <p className="text-slate-500 dark:text-zink-200">
                    {task.description}
                  </p>
                </div>

                <div className="flex w-full gap-3 mt-6 text-center divide-x divide-slate-200 dark:divide-zink-500 rtl:divide-x-reverse">
                  <div className="px-3 grow">
                    <h6 className="mb-1">{formatDueDate(task.dueDate)}</h6>
                    <p className="text-slate-500 dark:text-zink-200">
                      Due Date
                    </p>
                  </div>
                  <div className="px-3 grow">
                    <h6 className={`mb-1 ${getStatusClass(task.statut)}`}>
                      {task.statut}
                    </h6>
                    <p className="text-slate-500 dark:text-zink-200">Status</p>
                  </div>
                </div>

                <div className="w-full h-1.5 mt-8 rounded-full bg-slate-100 dark:bg-zink-600 p-7">
                  <div className="w-full bg-slate-200 rounded-full h-2.5 mb-7 dark:bg-zink-600">
                    <div
                      className={`bg-${
                        task.completionPercentage >= 75
                          ? "green"
                          : task.completionPercentage >= 50
                          ? "yellow"
                          : task.completionPercentage >= 25
                          ? "orange"
                          : "red"
                      }-500 h-2.5 rounded-full animate-progress relative`}
                      style={{ width: `${task.completionPercentage}%` }}
                    >
                      <div
                        className={`absolute ltr:right-0 rtl:left-0 inline-block px-2 py-0.5 text-[10px] text-white bg-${
                          task.completionPercentage >= 75
                            ? "green"
                            : task.completionPercentage >= 50
                            ? "yellow"
                            : task.completionPercentage >= 25
                            ? "orange"
                            : "red"
                        }-500 rounded -top-6 after:absolute after:border-4 ltr:after:right-1/2 rtl:after:left-1/2 after:-bottom-2 after:border-transparent after:border-t-custom-900`}
                      >
                        {task.completionPercentage}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="flex flex-col items-center gap-4 mt-2 mb-4 md:flex-row">
        <div className="grow">
          <p className="text-slate-500 dark:text-zink-200">
            Showing <b>8</b> of <b>30</b> Results
          </p>
        </div>
        <ul className="flex flex-wrap items-center gap-2 shrink-0">
          <li>
            <a
              href="#!"
              className="inline-flex items-center justify-center bg-white dark:bg-zink-700 size-8 transition-all duration-150 ease-linear border border-slate-200 dark:border-zink-500 rounded text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-50 dark:[&.active]:text-custom-50 [&.active]:bg-custom-500 dark:[&.active]:bg-custom-500 [&.active]:border-custom-500 dark:[&.active]:border-custom-500 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto"
            >
              <ChevronsLeft className="size-4 rtl:rotate-180"></ChevronsLeft>
            </a>
          </li>
          <li>
            <a
              href="#!"
              className="inline-flex items-center justify-center bg-white dark:bg-zink-700 size-8 transition-all duration-150 ease-linear border border-slate-200 dark:border-zink-500 rounded text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-50 dark:[&.active]:text-custom-50 [&.active]:bg-custom-500 dark:[&.active]:bg-custom-500 [&.active]:border-custom-500 dark:[&.active]:border-custom-500 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto"
            >
              <ChevronLeft className="size-4 rtl:rotate-180"></ChevronLeft>
            </a>
          </li>
          <li>
            <a
              href="#!"
              className="inline-flex items-center justify-center bg-white dark:bg-zink-700 size-8 transition-all duration-150 ease-linear border border-slate-200 dark:border-zink-500 rounded text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-50 dark:[&.active]:text-custom-50 [&.active]:bg-custom-500 dark:[&.active]:bg-custom-500 [&.active]:border-custom-500 dark:[&.active]:border-custom-500 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto active"
            >
              1
            </a>
          </li>
          <li>
            <a
              href="#!"
              className="inline-flex items-center justify-center bg-white dark:bg-zink-700 size-8 transition-all duration-150 ease-linear border border-slate-200 dark:border-zink-500 rounded text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-50 dark:[&.active]:text-custom-50 [&.active]:bg-custom-500 dark:[&.active]:bg-custom-500 [&.active]:border-custom-500 dark:[&.active]:border-custom-500 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto"
            >
              2
            </a>
          </li>
          <li>
            <a
              href="#!"
              className="inline-flex items-center justify-center bg-white dark:bg-zink-700 size-8 transition-all duration-150 ease-linear border border-slate-200 dark:border-zink-500 rounded text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-50 dark:[&.active]:text-custom-50 [&.active]:bg-custom-500 dark:[&.active]:bg-custom-500 [&.active]:border-custom-500 dark:[&.active]:border-custom-500 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto "
            >
              3
            </a>
          </li>
          <li>
            <a
              href="#!"
              className="inline-flex items-center justify-center bg-white dark:bg-zink-700 size-8 transition-all duration-150 ease-linear border border-slate-200 dark:border-zink-500 rounded text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-50 dark:[&.active]:text-custom-50 [&.active]:bg-custom-500 dark:[&.active]:bg-custom-500 [&.active]:border-custom-500 dark:[&.active]:border-custom-500 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto"
            >
              4
            </a>
          </li>
          <li>
            <a
              href="#!"
              className="inline-flex items-center justify-center bg-white dark:bg-zink-700 size-8 transition-all duration-150 ease-linear border border-slate-200 dark:border-zink-500 rounded text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-50 dark:[&.active]:text-custom-50 [&.active]:bg-custom-500 dark:[&.active]:bg-custom-500 [&.active]:border-custom-500 dark:[&.active]:border-custom-500 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto"
            >
              5
            </a>
          </li>
          <li>
            <a
              href="#!"
              className="inline-flex items-center justify-center bg-white dark:bg-zink-700 size-8 transition-all duration-150 ease-linear border border-slate-200 dark:border-zink-500 rounded text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-50 dark:[&.active]:text-custom-50 [&.active]:bg-custom-500 dark:[&.active]:bg-custom-500 [&.active]:border-custom-500 dark:[&.active]:border-custom-500 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto"
            >
              6
            </a>
          </li>
          <li>
            <a
              href="#!"
              className="inline-flex items-center justify-center bg-white dark:bg-zink-700 size-8 transition-all duration-150 ease-linear border border-slate-200 dark:border-zink-500 rounded text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-50 dark:[&.active]:text-custom-50 [&.active]:bg-custom-500 dark:[&.active]:bg-custom-500 [&.active]:border-custom-500 dark:[&.active]:border-custom-500 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto"
            >
              <ChevronRight className="size-4 rtl:rotate-180"></ChevronRight>
            </a>
          </li>
          <li>
            <a
              href="#!"
              className="inline-flex items-center justify-center bg-white dark:bg-zink-700 size-8 transition-all duration-150 ease-linear border border-slate-200 dark:border-zink-500 rounded text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-50 dark:[&.active]:text-custom-50 [&.active]:bg-custom-500 dark:[&.active]:bg-custom-500 [&.active]:border-custom-500 dark:[&.active]:border-custom-500 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto"
            >
              <ChevronsRight className="size-4 rtl:rotate-180"></ChevronsRight>
            </a>
          </li>
        </ul>
      </div>

      {/* Task Modal */}
      <Modal
        show={show}
        onHide={toggle}
        id="defaultModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen xl:w-[55rem] bg-white shadow rounded-md dark:bg-zink-600"
      >
        <Modal.Header
          className="flex items-center justify-between p-5 border-b dark:border-zink-500"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
        >
          <Modal.Title className="text-16">
            {!!isEdit ? "Edit Task" : "Create Task"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] overflow-y-auto p-5">
          <form
            noValidate
            className="create-form"
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
              className="hidden px-4 py-3 text-sm text-red-500 border border-transparent rounded-md bg-red-50 dark:bg-red-400/20"
            ></div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
              <div className="xl:col-span-4">
                <label
                  htmlFor="dueDateInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Due Date
                </label>
                <Flatpickr
                  id="dueDateInput"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  options={{
                    dateFormat: "d M, Y",
                  }}
                  placeholder="Select date"
                  onChange={(date: any) =>
                    validation.setFieldValue(
                      "dueDate",
                      moment(date[0]).format("DD MMMM ,YYYY")
                    )
                  }
                  value={validation.values.dueDate || ""}
                />
                {validation.touched.date && validation.errors.date ? (
                  <p className="text-red-400">{validation.errors.date}</p>
                ) : null}
              </div>
              <div className="xl:col-span-4">
                <label
                  htmlFor="notesTitleInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Task Title
                </label>
                <input
                  type="text"
                  id="notesTitleInput"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Title"
                  name="title"
                  onChange={validation.handleChange}
                  value={validation.values.title || ""}
                />
                {validation.touched.title && validation.errors.title ? (
                  <p className="text-red-400">{validation.errors.title}</p>
                ) : null}
              </div>

              <div className="xl:col-span-12">
                <div>
                  <label
                    htmlFor="textArea"
                    className="inline-block mb-2 text-base font-medium"
                  >
                    Description
                  </label>
                  <textarea
                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    id="textArea"
                    rows={6}
                    name="description"
                    onChange={validation.handleChange}
                    value={
                      new DOMParser().parseFromString(
                        validation.values.description,
                        "text/html"
                      ).body.textContent || ""
                    }
                  ></textarea>
                  {validation.touched.description &&
                  validation.errors.description ? (
                    <p className="text-red-400">
                      {validation.errors.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="reset"
                data-modal-close="addNotesModal"
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
                {!!isEdit ? "Update Task" : "Add Task"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default ProjectsTabs;
