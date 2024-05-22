import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ToastContainer, toast } from "react-toastify";
import { Eye, Trash2 } from 'lucide-react';
// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import Modal from "Common/Components/Modal";
import { useDispatch } from "react-redux";
import getToken from "helpers/jwt-token-access/tokenAccess";

import {UPDATE_TASK_STATUS, UPDATE_TASK_PERCENTAGE, DELETE_TASK_BY_ID} from "services/tasksAPIs/tasksAPIs"

const ListTasks = ({setAllTasks, allTasks, fetchTasksData, isEditClicked}:any)=> {
    console.log("calling listTasks...")
    console.log(allTasks);

    useEffect(() => {
        fetchTasksData();
      }, [])

    const [todoTasks, setTodoTasks]=useState();
    const [inProgressTasks, setInProgressTasks]= useState();
    const [CompleteTasks, setCompleteTasks]= useState();



    useEffect(() => {
        setInProgressTasks(allTasks.filter((task:any)=>task.statut === "enCours"));
        setCompleteTasks(allTasks.filter((task:any)=>task.statut === "termine"));
        setTodoTasks(allTasks.filter((task:any)=>task.statut === "todo"));
      }, [allTasks]);
const statues = ["todo","enCours","termine"];

return (
    <>
      {inProgressTasks && CompleteTasks && (
        <div className="flex flex-col lg:flex-row lg:gap-8 justify-center">
          {statues.map((statut, index) => (
            <Section
              key={index}
              statut={statut}
              setTodoTasks={setTodoTasks}
              setCompleteTasks={setCompleteTasks}
              setInProgressTasks={setInProgressTasks}
              todoTasks={todoTasks}
              inProgress={inProgressTasks}
              CompleteTasks={CompleteTasks}
              allTasks={allTasks}
              setAllTasks={setAllTasks}
              fetchTasksData={fetchTasksData}
              isEditClicked={isEditClicked}
            />
          ))}
        </div>
      )}
    </>
  );
  
}

export default ListTasks



const Section = ({fetchTasksData,statut, inProgress, CompleteTasks, setCompleteTasks, setInProgressTasks, allTasks, setAllTasks, todoTasks, setTodoTasks, isEditClicked}:any) =>{
    


    const [{ isOver }, drop] = useDrop(() => ({
        accept: "task",
        drop: (item:any)=>addItemToSection(item.task) ,
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        })
      }))

      async function addItemToSection(item: any): Promise<void> {
        if (item.statut === statut) {
            return; // If the task is already in the same section, do nothing
        }
    
        console.log(item);
        console.log("dropped ", item._id);
        console.log("from : ", item.statut);
        console.log("to statut ", statut);
    
        try {
            // Update the statut of the dropped task
            const updatedTask = { ...item, statut };
    
            // Update the local state based on the dropped item
            switch (item.statut) {
                case "todo":
                    setTodoTasks((prevTasks: any) => prevTasks.filter((task: any) => task._id !== item._id));
                    break;
                case "termine":
                    setCompleteTasks((prevTasks: any) => prevTasks.filter((task: any) => task._id !== item._id));
                    break;
                case "enCours":
                    setInProgressTasks((prevTasks: any) => prevTasks.filter((task: any) => task._id !== item._id));
                    break;
                default:
                    break;
            }
    
            switch (statut) {
                case "todo":
                    setTodoTasks((prevTasks: any) => [...prevTasks, updatedTask]);
                    break;
                case "termine":
                    setCompleteTasks((prevTasks: any) => [...prevTasks, updatedTask]);
                    break;
                case "enCours":
                    setInProgressTasks((prevTasks: any) => [...prevTasks, updatedTask]);
                    break;
                default:
                    break;
            }
    
            // Update the database
            await updateTaskById(item._id, statut);
        } catch (error) {
            console.error('Error updating task in the database:', error);
        }
    }
    
    
    

    // create a function to update a state of a task by id (by the api):
    const updateTaskById = async (id: string, statut: string) => {
        try {
            const response = await axios.put(`${UPDATE_TASK_STATUS+id}`, { statut },{
                headers: {
                    'authorization': `Bearer ${getToken()}`, 
                  },
            });
            if (response) {
            
            }
            else {
                toast.error("Error updating status", { autoClose: 2000 });
            }

        } catch (error) {
            console.error(error);
        }
    }
    



    let text= "Todo";
    let bg = "bg-slate-500";
    let tasksToMap = todoTasks
    if(statut === "todo"){
        text = "Todo";
        bg = "bg-slate-500";
        tasksToMap = todoTasks
    }
    if(statut === "termine"){
        text = "Completed";
        bg = "bg-green-500";
        tasksToMap = CompleteTasks
    }
    if(statut === "enCours"){
        text = "In Progress";
        bg = "bg-yellow-500";
        tasksToMap = inProgress
    }
    return(
        <div ref={drop} className={`w-full card w-64 rounded-md p-2 ${isOver ? "bg-slate-200":""}`} >
             <ToastContainer closeButton={false} limit={1} />
            <Header text={text} bg={bg} count={tasksToMap.length}/>
            {tasksToMap.length > 0 && tasksToMap.map((task:any, index:any)=>(
                
                <Task key={task._id} task={task} setCompleteTasks={setCompleteTasks} setInProgressTasks={setInProgressTasks} inProgress={inProgress} completed={CompleteTasks} fetchTasksData={fetchTasksData}  isEditClicked={isEditClicked}/>
            ))}
        </div>
    )
}

const Header = ({text, bg, count}:any) =>{
    return(
        <div className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase text-white`}
        >{text}<div className="ml-2 bg-white w-5 h-5 text-black rounded-full flex items-center justify-center">
            {count}</div>
            </div>
    )
}


const Task = ({ task, setCompleteTasks, setInProgressTasks, inProgress, completed, fetchTasksData, isEditClicked}:any) =>{

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "task",
        item: {task},
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging()
        })
      }))

      console.log(isDragging)

      const dispatch = useDispatch<any>();


      const [eventData, setEventData] = useState<any>();
  
      const [show, setShow] = useState<boolean>(false);
      const [isEdit, setIsEdit] = useState<boolean>(false);


      

       // validation
    const validation: any = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            completionPercentage: task.completionPercentage || '',
           
        },
        validationSchema: Yup.object({
            completionPercentage: Yup.string().required("Please Enter completion Percentage"),
            
        }),

        onSubmit: (values) => {
            if (isEdit) {
                const updateData = {
                    id: eventData ? eventData.id : 0,
                    ...values,
                };

               
                // update user
                // dispatch(onUpdateEvents(updateData));
            } else {
                const newData = {
                    ...values,
                    id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
                  
                };
                if(task.completionPercentage!=values.completionPercentage){
                    console.log(values);
                }
                
                // save new percentage
                dispatch(updateTaskPercentageById(task._id,values));
            }
            toggle();
        },
    });




    const updateTaskPercentageById = async (id: string, completionPercentage: any) => {
        try {
            const response = await axios.put(`${UPDATE_TASK_PERCENTAGE+id}`, completionPercentage,{
                headers: {
                    'authorization': `Bearer ${getToken()}`, 
                  },
            });
            if (response) {
                fetchTasksData();
                toast.success("percentage updated successfully", { autoClose: 2000 });
            }
            else {
                toast.error("Error updating percentage", { autoClose: 2000 });
            }
            
            toggle();
        } catch (error) {
            console.error(error);
        }

    }


    

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





      const handleViewClick=(taskId:any)=>{
        toggle();
        console.log("clicked : ", taskId);
      }

      const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaClick = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      document.execCommand('copy');
      toast.success("Text copied to clipboard", { autoClose: 2000 });
    }
  };


 const getTimeLeft = (dueDate: Date): string => {

    // Get the current date
    const currentDate: Date = new Date();
    // Calculate the time remaining in milliseconds
    const timeRemainingMs: number = dueDate.getTime() - currentDate.getTime();
    // Convert milliseconds to days, hours, minutes, and seconds
    const daysRemaining: number = Math.floor(timeRemainingMs / (1000 * 60 * 60 * 24));
    const hoursRemaining: number = Math.floor((timeRemainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesRemaining: number = Math.floor((timeRemainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const secondsRemaining: number = Math.floor((timeRemainingMs % (1000 * 60)) / 1000);

    return `${daysRemaining} days, ${hoursRemaining} hours, ${minutesRemaining} minutes, ${secondsRemaining} seconds`;
};




    const deleteTaskById = async (taskId:string) => {
        try {
            console.log("task id")
            console.log(taskId)
          const response = await fetch(`${DELETE_TASK_BY_ID+taskId}`, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${getToken()}`, 
              },
          });
          if (!response.ok) {
            toast.error("Error deleting Task", { autoClose: 2000 });
          }
          
          toast.success("Task deleted successfully", { autoClose: 2000 })

          // You can trigger a data refresh here if needed
        
            await fetchTasksData();

        } catch (error) {
          console.error('Error deleting intern:', error);
          toast.error("Error deleting intern", { autoClose: 2000 });

        }
      };



      const formatDueDate = (dueDateStr: string): string => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const dueDate = new Date(dueDateStr);
        return dueDate.toLocaleDateString('en-GB', options); // Adjust locale as needed
    };


    return(
        <div {...(!show ? { ref: drag } : {})} className={` w-full dark:focus:text-white dark:active:text-white active:text-white focus:ring  dark:hover:text-white text-purple-500 bg-purple-100 hover:text-white hover:bg-purple-600 focus:bg-purple-600 focus:ring-purple-100 active:bg-purple-600 active:ring-purple-100 dark:bg-purple-500/20  relative p-4 mt-2 shadow-md rounded-md  ${isDragging ? "opacity-25":"opacity-100"} cursor-grab`}>
               <p>{task.title}</p>
               
               {isEditClicked ? 
               <button className="absolute bottom-3 right-2" onClick={()=>deleteTaskById(task._id)}> <Trash2 className="w-5" /> </button>
               :<button className="absolute bottom-3 right-2" onClick={()=>handleViewClick(task._id)}>  <Eye className="w-5" /></button>}
               
               



                <Modal show={show} onHide={toggle} modal-center="true"
                className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
                dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600">
                <Modal.Header className="flex items-center justify-between p-4 border-b dark:border-zink-500"
                    closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500">
                    <Modal.Title className="text-16">Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
                    <form className="needs-validation" name="event-form" id="form-event"
                    onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                    }}>

               <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                        <div className="xl:col-span-12">
                            <label htmlFor="task-desc" className="text-blue-500 inline-block mb-2 text-base font-medium">Task Description</label>
                            <textarea
                                id="task-desc"
                                ref={textareaRef}
                                className="h-40 text-black form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                placeholder="Event name"
                                readOnly
                                value={task.description || ""}
                                onClick={handleTextareaClick}
                            />
                        </div>


                        <div className="xl:col-span-12">
                            <label htmlFor="task-deadline" className="text-blue-500 inline-block mb-2 text-base font-medium">Due Date</label>
                            <input
                                disabled
                                id="task-deadline"
                                className="text-black form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                placeholder="Event name"
                                readOnly
                                value={formatDueDate(task.dueDate) || ""}
                                onClick={handleTextareaClick}
                            />
                        </div>

                        <div className="xl:col-span-12">
                            <label htmlFor="task-deadline" className="text-blue-500 inline-block mb-2 text-base font-medium">Time Left</label>
                            <input
                                disabled
                                id="task-deadline"
                                className="text-black form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                placeholder="Event name"
                                readOnly
                                value={getTimeLeft(new Date(task.dueDate)) || ""}
                                onClick={handleTextareaClick}
                            />
                        </div>



                            <div className="xl:col-span-12">
                                <label htmlFor="completionPercentage" className="text-blue-500 inline-block mb-2 text-base font-medium">Completion Percentage</label>
                                <input type="range" id="completionPercentage" className=" text-black form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                    name="completionPercentage"
                                    onChange={validation.handleChange}
                                    value={validation.values.completionPercentage || 0}
                                    min="0" 
                                    max="100"
                                />
                                <span className="text-black">{validation.values.completionPercentage || 0}%</span>
                                {validation.touched.completionPercentage && validation.errors.completionPercentage ? (
                                    <p className="text-red-400">{validation.errors.completionPercentage}</p>
                                ) : null}
                            </div>
                            
                            
                </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button type="reset" className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-600 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10" onClick={toggle}>Cancel</button>
                            <button type="submit" id="btn-save-event" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">Update</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>


        </div>
    )
}


