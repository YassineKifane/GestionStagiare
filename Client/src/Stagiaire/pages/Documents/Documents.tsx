import React, { useCallback, useEffect, useState } from "react";
import {Eye, Trash2, UploadCloud } from "lucide-react";
import Modal from 'Common/Components/Modal';
// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
import DeleteModal from 'Common/DeleteModal';
import Dropzone from "react-dropzone";
import {storage} from "helpers/firebaseConfig";
import { ref, getDownloadURL, uploadBytesResumable, UploadTaskSnapshot } from "firebase/storage";
import getToken from "helpers/jwt-token-access/tokenAccess";

import {BASE_DOC_URL, ADD_DOCUMENT, DELETE_DOCUMENT} from "services/documentsAPIs/documentsAPIs"

interface FileItem { _id: string; fileType: string; fileName: string; fileSize: string; createdAt: string; status: string; url:string }


// parrainId, internId, documents, getAllDocumentsByReceiverId, setDocuments, docsReceived, setDocsReceived


const Documents = () => {


    const [internId, setInternId] = React.useState<any>(null);
    const [parrainId, setParrainId] = useState();
    const [documents, setDocuments] = useState(null);
    const [docsReceived, setDocsReceived] = useState(null);
    const authUser = localStorage.getItem("authUser");


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if authUser is not null or undefined
                if (authUser) {
                    // Parse the JSON string to convert it back to an object
                    const authUserData = JSON.parse(authUser);
                    console.log(authUserData); // Log the authUser data
                    setParrainId(authUserData.parrainId);
                    setInternId(authUserData.internId);
                   
    
                    // Fetch documents for parrain and intern
                    await getAllDocumentsByReceiverId(authUserData.internId,authUserData.parrainId, setDocuments);
                    await getAllDocumentsByReceiverId(authUserData.parrainId,authUserData.internId, setDocsReceived);
                } else {
                    console.log("authUser not found in localStorage");
                }
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };
    
        fetchData();
    }, [authUser]);
    
    // Function to fetch documents by receiver ID
    const getAllDocumentsByReceiverId = async (senderId:any,receiverId:any,setElement:any) => {
        try {
            console.log("senderId: " + senderId);
            console.log("receiverId: " + receiverId);
            const response = await fetch(`${BASE_DOC_URL}/get/sender/${senderId}/receiver/${receiverId}`,{
                headers: {
                    'authorization': `Bearer ${getToken()}`, 
                  },
            });
            const data = await response.json();
            if (response.ok) {
                setElement(data.data.documents);
                console.log(data.data.documents);
               

            } else {
                throw new Error(data.message || 'Failed to fetch documents');
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
            throw error;
        }
    };



const [eventData, setEventData] = useState<any>();
const [isinProgress, setIsinProgress]=useState<Boolean>(false);

const [show, setShow] = useState<boolean>(false);
const [isEdit, setIsEdit] = useState<boolean>(false);
// const dispatch = useDispatch<any>();

 // Delete Modal
 const [deleteModal, setDeleteModal] = useState<boolean>(false);
 const deleteToggle = () => setDeleteModal(!deleteModal);


// validation
const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
        fileName: (eventData && eventData.fileName) || '',
       
    },
    validationSchema: Yup.object({
        
        fileName: Yup.string().required("Please Enter Title"),
       
       

    }),


    onSubmit: async(values) => {
       
            // Upload the file to Firebase
            let document = await uploadFileToFirebase(selectedFiles[0]);
            if(document==null){
                document=''
            }
           // the url and fileSize, fileType is undifined please solve it
            const newData = {
                ...values,
                url: document,
                fileSize: selectedFiles[0].formattedSize,
                fileType: selectedFiles[0].type,
                sender: internId,
                receiver: parrainId,  
              
            };
            console.log(newData);
            // save new user
            try {
                console.log("form data :");
                console.log(newData);
                const response = await fetch(`${ADD_DOCUMENT}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${getToken()}`, 
                 
                    },
                    body: JSON.stringify(newData),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                  
                }
                const data = await response.json();
                console.log(data);
                // handle successful response
                toast.success("Document Added Successfully", { autoClose: 3000 });

                setInterval(async () => {
                  await getAllDocumentsByReceiverId(internId,parrainId, setDocuments);
                  
                  }, 1000);

            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                toast.error("Document Added Failed", { autoClose: 2000 });
                // handle error
            }
          

      
        toggle();
    },
});



// file handling

const [selectedFiles, setSelectedFiles] = React.useState<any>([]);

const handleAcceptedFiles = async (files: any) => {
    if (files.length === 0) return;

    const file = files[0];

    // Add preview and formatted size to the file object
    const updatedFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
    });

    
    setSelectedFiles([updatedFile]);
    

   
}




const uploadFileToFirebase = async (updatedFile: File) => {
    console.log("uploading file");
    console.log(updatedFile.name);

    const storageRef = ref(storage, `files/${updatedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, updatedFile);

    try {
        const snapshot: UploadTaskSnapshot = await new Promise((resolve, reject) => {
            const unsubscribe = uploadTask.on("state_changed",
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
        });

        console.log('Upload is complete');
        const downloadURL = await getDownloadURL(storageRef);
        console.log('File available at', downloadURL);
        setIsinProgress(false);
        return downloadURL;
      

    } catch (error) {
        console.error('Error uploading file:', error);
    }
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

const handleDelete = () => {
    if (eventData) {
        // deleteTaskById(taskId);
        setDeleteModal(false);
        
    }
};





    const formatBytes = (bytes: any, decimals = 2) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    }



    const formatDate = (dueDateStr: string): string => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const dueDate = new Date(dueDateStr);
        return dueDate.toLocaleDateString('en-GB', options); // Adjust locale as needed
    };
    

    const handleDocDeletion=async(id:any)=>{
        try {
            
          
          const response = await fetch(`${DELETE_DOCUMENT+id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${getToken()}`, 
         
            },
          });
          if (!response.ok) {
            toast.error("Error deleting Document", { autoClose: 2000 });
          }
          
          toast.success("Document deleted successfully", { autoClose: 2000 });
         

          // You can trigger a data refresh here if needed
        
          setInterval(async () => {    
            await getAllDocumentsByReceiverId(internId,parrainId, setDocuments);
            }, 1000);

        } catch (error) {
          console.error('Error deleting intern:', error);
          toast.error("Error deleting intern", { autoClose: 2000 });

        }
    }


  



    return (
        <React.Fragment>
            <DeleteModal show={deleteModal} onHide={deleteToggle} onDelete={handleDelete} />
            <ToastContainer closeButton={false} limit={1} />
            <div className="flex items-center gap-3 mb-4 mt-8">
                <h5 className="underline grow">Documents Sent</h5>
                <div className="shrink-0">
                    <button data-modal-target="addDocuments" type="button" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"  onClick={toggle}>Add Document</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full align-middle border-separate whitespace-nowrap border-spacing-y-1">
                    <thead className="text-left bg-white dark:bg-zink-700">
                        <tr>
                            <th className="px-3.5 py-2.5 font-semibold border-b border-transparent">
                                <div className="flex items-center h-full">
                                    <input id="Checkbox1" className="size-4 bg-white border border-slate-200 checked:bg-none dark:bg-zink-700 dark:border-zink-500 rounded-sm appearance-none arrow-none relative after:absolute after:content-['\eb7b'] after:top-0 after:left-0 after:font-remix after:leading-none after:opacity-0 checked:after:opacity-100 after:text-custom-500 checked:border-custom-500 dark:after:text-custom-500 dark:checked:border-custom-800" type="checkbox" defaultValue="" />
                                </div>
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold border-b border-transparent">Documents Type</th>
                            <th className="px-3.5 py-2.5 font-semibold border-b border-transparent">Documents Name</th>
                            <th className="px-3.5 py-2.5 font-semibold border-b border-transparent">File Size</th>
                            <th className="px-3.5 py-2.5 font-semibold border-b border-transparent">Created At</th>
             
                            <th className="px-3.5 py-2.5 font-semibold border-b border-transparent">Status</th>
                            <th className="px-3.5 py-2.5 font-semibold border-b border-transparent text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(documents || [])?.map((item: FileItem, index: number) => (
                            <tr key={index} className="bg-white dark:bg-zink-700">
                                <td className="px-3.5 py-2.5 border-y border-transparent">
                                    <div className="flex items-center h-full">
                                        <input
                                            id={`Checkbox${item._id}`}
                                            className="size-4 bg-white border border-slate-200 checked:bg-none dark:bg-zink-700 dark:border-zink-500 rounded-sm appearance-none arrow-none relative after:absolute after:content-['\eb7b'] after:top-0 after:left-0 after:font-remix after:leading-none after:opacity-0 checked:after:opacity-100 after:text-custom-500 checked:border-custom-500 dark:after:text-custom-500 dark:checked:border-custom-800"
                                            type="checkbox"
                                            value=""
                                        />
                                    </div>
                                </td>
                                <td className="px-3.5 py-2.5 border-y border-transparent">
                                    <span className="px-2.5 py-0.5 inline-block text-xs font-medium rounded border bg-slate-100 border-transparent text-slate-500 dark:bg-slate-500/20 dark:text-zink-200 dark:border-transparent">{item.fileType}</span>
                                </td>
                                <td className="px-3.5 py-2.5 border-y border-transparent">{item.fileName}</td>
                                <td className="px-3.5 py-2.5 border-y border-transparent">{item.fileSize}</td>
                                <td className="px-3.5 py-2.5 border-y border-transparent">{formatDate(item.createdAt)}</td>
                               
                                <td className="px-3.5 py-2.5 border-y border-transparent">
                                    <span className={"px-2.5 py-0.5 inline-block text-xs font-medium rounded border bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent"}>Success</span>
                                </td>
                                <td className="px-3.5 py-2.5 border-y border-transparent">
                                    <div className="flex items-center justify-end gap-2">
                                        <a href={`${item.url}`} className="flex items-center justify-center size-8 transition-all duration-150 ease-linear rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-zink-600 dark:hover:bg-zink-500">
                                            <Eye className="size-3"></Eye>
                                        </a>
                      
                                        <a onClick={() => handleDocDeletion(item._id)} className="flex items-center justify-center size-8 transition-all duration-150 ease-linear rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-zink-600 dark:hover:bg-zink-500">
                                            <Trash2 className="size-3"></Trash2>
                                        </a>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>





            <div className="flex items-center gap-3 mb-4 mt-4">
                <h5 className="underline grow">Documents Received</h5>
              
            </div>
            <div className="overflow-x-auto">
                <table className="w-full align-middle border-separate whitespace-nowrap border-spacing-y-1">
                    <thead className="text-left bg-white dark:bg-zink-700">
                        <tr>
                            <th className="px-3.5 py-2.5 font-semibold border-b border-transparent">
                                <div className="flex items-center h-full">
                                    <input id="Checkbox1" className="size-4 bg-white border border-slate-200 checked:bg-none dark:bg-zink-700 dark:border-zink-500 rounded-sm appearance-none arrow-none relative after:absolute after:content-['\eb7b'] after:top-0 after:left-0 after:font-remix after:leading-none after:opacity-0 checked:after:opacity-100 after:text-custom-500 checked:border-custom-500 dark:after:text-custom-500 dark:checked:border-custom-800" type="checkbox" defaultValue="" />
                                </div>
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold border-b border-transparent">Documents Type</th>
                            <th className="px-3.5 py-2.5 font-semibold border-b border-transparent">Documents Name</th>
                            <th className="px-3.5 py-2.5 font-semibold border-b border-transparent">File Size</th>
                            <th className="px-3.5 py-2.5 font-semibold border-b border-transparent">Created At</th>
             
                            <th className="px-3.5 py-2.5 font-semibold border-b border-transparent">Status</th>
                            <th className="px-3.5 py-2.5 font-semibold border-b border-transparent text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(docsReceived || [])?.map((item: FileItem, index: number) => (
                            <tr key={index} className="bg-white dark:bg-zink-700">
                                <td className="px-3.5 py-2.5 border-y border-transparent">
                                    <div className="flex items-center h-full">
                                        <input
                                            id={`Checkbox${item._id}`}
                                            className="size-4 bg-white border border-slate-200 checked:bg-none dark:bg-zink-700 dark:border-zink-500 rounded-sm appearance-none arrow-none relative after:absolute after:content-['\eb7b'] after:top-0 after:left-0 after:font-remix after:leading-none after:opacity-0 checked:after:opacity-100 after:text-custom-500 checked:border-custom-500 dark:after:text-custom-500 dark:checked:border-custom-800"
                                            type="checkbox"
                                            value=""
                                        />
                                    </div>
                                </td>
                                <td className="px-3.5 py-2.5 border-y border-transparent">
                                    <span className="px-2.5 py-0.5 inline-block text-xs font-medium rounded border bg-slate-100 border-transparent text-slate-500 dark:bg-slate-500/20 dark:text-zink-200 dark:border-transparent">{item.fileType}</span>
                                </td>
                                <td className="px-3.5 py-2.5 border-y border-transparent">{item.fileName}</td>
                                <td className="px-3.5 py-2.5 border-y border-transparent">{item.fileSize}</td>
                                <td className="px-3.5 py-2.5 border-y border-transparent">{formatDate(item.createdAt)}</td>
                               
                                <td className="px-3.5 py-2.5 border-y border-transparent">
                                    <span className={"px-2.5 py-0.5 inline-block text-xs font-medium rounded border bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent"}>Success</span>
                                </td>
                                <td className="px-3.5 py-2.5 border-y border-transparent">
                                    <div className="flex items-center justify-end gap-2">
                                        <a href={`${item.url}`} className="flex items-center justify-center size-8 transition-all duration-150 ease-linear rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-zink-600 dark:hover:bg-zink-500">
                                            <Eye className="size-3"></Eye>
                                        </a>
                      
                                        

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>





             {/* Document Modal */}
             <Modal show={show} onHide={toggle} id="defaultModal" modal-center="true"
                className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
                dialogClassName="w-screen xl:w-[55rem] bg-white shadow rounded-md dark:bg-zink-600">
                <Modal.Header className="flex items-center justify-between p-5 border-b dark:border-zink-500"
                    closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500">
                    <Modal.Title className="text-16">{!!isEdit ? "Edit Task" : "Send Document"}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] overflow-y-auto p-5">
                    <form noValidate className="create-form" onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                    }}>
                        <input type="hidden" value="" name="id" id="id" />
                        <input type="hidden" value="add" name="action" id="action" />
                        <input type="hidden" id="id-field" />
                        <div id="alert-error-msg" className="hidden px-4 py-3 text-sm text-red-500 border border-transparent rounded-md bg-red-50 dark:bg-red-400/20"></div>
                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                           
                            <div className="xl:col-span-12">
                                <label htmlFor="notesTitleInput" className="inline-block mb-2 text-base font-medium">Document Name</label>
                                <input type="text" id="notesTitleInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Attestation, Convention.."
                                    name="fileName"
                                    onChange={validation.handleChange}
                                    value={validation.values.fileName || ""}
                                />
                                {validation.touched.fileName && validation.errors.fileName ? (
                                    <p className="text-red-400">{validation.errors.fileName}</p>
                                ) : null}
                            </div>
                           
                            <div className="xl:col-span-12">
                                {/* file upload */}
                                
                                <div className="flex items-center justify-center border rounded-md cursor-pointer bg-slate-100 dropzone border-slate-200 dark:bg-zink-600 dark:border-zink-500 dz-clickable">

                            <Dropzone
                                onDrop={(acceptedFiles: any) => {
                                    handleAcceptedFiles(acceptedFiles)
                                }}
                            >
                                {({ getRootProps, getInputProps }: any) => (
                                    <div
                                        className="w-full py-5 text-lg text-center dz-message needsclick"
                                        {...getRootProps()}
                                    >
                                        <input {...getInputProps()} />
                                        
                                        <div className="mb-3">
                                            <UploadCloud className="block size-12 mx-auto text-slate-500 fill-slate-200 dark:text-zink-200 dark:fill-zink-500"></UploadCloud>
                                        </div>

                                        <h5 className="mb-0 font-normal text-slate-500 text-15">Drag and drop your files or <a href="#!">browse</a> your files</h5>
                                    </div>
                                )}
                            </Dropzone>

                            
                           
                        </div>

                        <div className="mt-5 mb-2 flex justify-center items-center">
                        {isinProgress ? (
                            <div className="inline-block size-8 border-2 border-green-500 rounded-full animate-spin border-l-transparent"></div>
                        ) : null}
                        </div>

                        <ul className="mb-0" id="dropzone-preview">
                            {
                                (selectedFiles || [])?.map((f: any, i: any) => {
                                    return (
                                        <li className="mt-2" id="dropzone-preview-list" key={i + "-file"}>
                                            <div className="border rounded border-slate-200 dark:border-zink-500">
                                                <div className="flex p-2">
                                                    <div className="shrink-0 me-3">
                                                        <div className="p-2 rounded-md size-14 bg-slate-100 dark:bg-zink-600">
                                                            <img data-dz-thumbnail className="block w-full h-full rounded-md" src={f.preview} alt={f.name} />
                                                        </div>
                                                    </div>
                                                    <div className="grow">
                                                        <div className="pt-1">
                                                            <h5 className="mb-1 text-15" data-dz-name>{f.name}</h5>
                                                            <p className="mb-0 text-slate-500 dark:text-zink-200" data-dz-size>{f.formattedSize}</p>
                                                        </div>
                                                    </div>
                                                    <div className="shrink-0 ms-3">
                                                        <button data-dz-remove
                                                            className="px-2 py-1.5 text-xs text-white bg-red-500 border-red-500 btn hover:text-white hover:bg-red-600 hover:border-red-600 focus:text-white focus:bg-red-600 focus:border-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600 active:border-red-600 active:ring active:ring-red-100 dark:ring-custom-400/20"
                                                            onClick={() => {
                                                                const newImages = [...selectedFiles];
                                                                newImages.splice(i, 1);
                                                                setSelectedFiles(newImages);
                                                            }}
                                                        >Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>

                       




                            </div>







                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button type="reset" data-modal-close="addNotesModal" className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-600 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
                                onClick={toggle}>Cancel</button>
                            <button type="submit" id="addNew" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">
                                {!!isEdit ? "Update" : "Send"}
                            </button>
                        </div>

                        
                    </form>
                    
                </Modal.Body>
            </Modal>





    
        </React.Fragment>
    );
}

export default Documents;