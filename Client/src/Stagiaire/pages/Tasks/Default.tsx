import React, { useCallback, useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import getToken from "helpers/jwt-token-access/tokenAccess";

import moment from "moment";
import {FETCH_TASKS, CREATE_TASK, UPDATE_TASK_BY_ID} from "services/tasksAPIs/tasksAPIs"

// react-redux
import { useDispatch } from "react-redux";
// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import Modal from "Common/Components/Modal";

import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import ListTasks from "./ListTasks";

const DefaultCalendar = () => {
  const [allTasks, setAllTasks] = useState<any>();
  const [internId, setInternId] = useState<any>();

  const fetchTasksData = async () => {
    try {
      console.log(internId);
      const response = await fetch(`${FETCH_TASKS+internId}`, {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAllTasks(data.tasks);
      console.log(data.tasks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const authUser = localStorage.getItem("authUser");

    // Check if authUser is not null or undefined
    if (authUser) {
      const authUserData = JSON.parse(authUser);
      setInternId(authUserData.internId);
    }

    // setAllTasks(AllData);

    fetchTasksData();
  }, [internId]);

  const dispatch = useDispatch<any>();

  const [eventData, setEventData] = useState<any>();

  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

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
          internId: internId,
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
              authorization: `Bearer ${getToken()}`,
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

          fetchTasksData();
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
    return fetch(`${UPDATE_TASK_BY_ID+taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getToken()}`,
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
        }, 300);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  //
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

  const [isEditClicked, setIsEditClicked] = useState<boolean>(false);

  return (
    <React.Fragment>
      {/* <DeleteModal show={deleteModal} onHide={deleteToggle} onDelete={handleDelete} /> */}
      <ToastContainer closeButton={false} limit={1} />

      <div className="flex items-center gap-3 mt-4 mb-4">
        <h5 className="underline grow">Tasks</h5>
        <div className="flex items-center gap-3 mb-4">
          <div className="shrink-0">
            <button
              type="button"
              className={`text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-600 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10 ${
                isEditClicked ? "active" : ""
              }`}
              onClick={() => {
                setIsEditClicked(!isEditClicked); // Toggle the state between true and false
              }}
            >
              {isEditClicked ? "Edit Mode : On" : "Edit Mode : Off"}
            </button>
          </div>
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
      </div>
      {allTasks && (
        <ListTasks
          allTasks={allTasks}
          setAllTasks={setAllTasks}
          fetchTasksData={fetchTasksData}
          isEditClicked={isEditClicked}
        />
      )}

      {/* Events Modal */}

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

export default DefaultCalendar;
