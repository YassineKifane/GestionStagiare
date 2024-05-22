import React, { useEffect, useState } from "react";
import AccountInfo from "./AccountInfo";
import { Nav } from "Common/Components/Tab/Nav";
import Tab from "Common/Components/Tab/Tab";
import OverviewTabs from "./OverviewTabs";
import Documents from "./Documents";
import ProjectsTabs from "./ProjectsTabs";
import { useLocation } from 'react-router-dom';
import getToken from "helpers/jwt-token-access/tokenAccess";
import {BASE_DOC_URL} from "services/documentsAPIs/documentsAPIs"
import {GET_INTERN_BY_ID} from "services/internsAPIs/internsAPIs"
import {NUMBER_OF_TASKS_BY_ID} from "services/tasksAPIs/tasksAPIs"


interface TaskStatus {
    [key: string]: number;
}

const Account = () => {

    document.title = "Account | OCP Parrian";
    const location = useLocation();
    
    const [intern, setIntern] = React.useState<any>(null);
    const [taskStatus, setTaskStatus] = useState<TaskStatus>();
    const searchParams = new URLSearchParams(location.search);
    const internId = searchParams.get('internId');
    const [parrainId, setParrainId] = useState();
    const [documents, setDocuments] = useState(null);
    const authUser = localStorage.getItem("authUser");
    const [docsReceived, setDocsReceived] = useState(null);


     // get all docs
     const getAllDocumentsReceived = async (senderId:any,receiverId:any) => {
        try {
            console.log("senderId: " + senderId);
            console.log("receiverId: " + receiverId);
            const response = await fetch(`${BASE_DOC_URL}/get/sender/${senderId}/receiver/${receiverId}`,{
                headers: {
                    'authorization': `Bearer ${getToken()}`, // Include the token in the Authorization header
                },
            });
            const data = await response.json();
            if (response.ok) {
                setDocsReceived(data.data.documents);
                console.log("Documents data :");
                console.log(data.data.documents);
               

            } else {
                throw new Error(data.message || 'Failed to fetch documents');
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
            throw error;
        }
    };


    const getAllDocumentsSended = async (senderId:any,receiverId:any) => {
        try {
            console.log("senderId: " + senderId);
            console.log("receiverId: " + receiverId);
            const response = await fetch(`${BASE_DOC_URL}/get/sender/${senderId}/receiver/${receiverId}`,{
                headers: {
                    'authorization': `Bearer ${getToken()}`, // Include the token in the Authorization header
                },
            });
            const data = await response.json();
            if (response.ok) {
                setDocuments(data.data.documents);
                console.log("Documents data :");
                console.log(data.data.documents);
               

            } else {
                throw new Error(data.message || 'Failed to fetch documents');
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
            throw error;
        }
    };
    

    useEffect(()=>{
        if(internId){
            getInternById(internId);
            getNumberOfTasksById(internId);
        }
 
            // Check if authUser is not null or undefined
            if (authUser) {
                // Parse the JSON string to convert it back to an object
                const authUserData = JSON.parse(authUser);
                console.log(authUserData); // Log the authUser data
                setParrainId(authUserData.parrainId)
                console.log("parrain ID:")
                console.log(parrainId);
                
                
                
            } else {
                console.log("authUser not found in localStorage");
            }
        
    },[authUser, internId, parrainId]);



    useEffect(() => {
        if (internId && parrainId) {
            (async () => {
                try {
                    
                       await getAllDocumentsSended(parrainId, internId);
                       await getAllDocumentsReceived(internId, parrainId);
                
                    
                   
                } catch (error) {
                    console.error('Error:', error);
                }
            })();
        }
    }, [internId, parrainId]);




    async function getInternById(internId:string) {
        try {
            const response = await fetch(`${GET_INTERN_BY_ID+internId}`,{
                headers: {
                    'authorization': `Bearer ${getToken()}`, // Include the token in the Authorization header
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch intern');
            }
            const data = await response.json();
            setIntern(data);
            console.log(data);
            
        } catch (error) {
            console.error('Error fetching intern:', error);
            throw error;
        }
    }

    async function getNumberOfTasksById(internId:string) {
        try {
          
            const response = await fetch(`${NUMBER_OF_TASKS_BY_ID+internId}`,{
                headers: {
                    'authorization': `Bearer ${getToken()}`, // Include the token in the Authorization header
                },
            }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setTaskStatus(data.numberOfTasksByStatus);
            console.log("task status...")
            console.log(data.numberOfTasksByStatus);
        } catch (error) {
            console.error('Error fetching task status:', error);
        }
    }

    return (
        <React.Fragment>
            <Tab.Container defaultActiveKey="overviewTabs">
                <div className="mt-1 -ml-3 -mr-3 rounded-none card">
                    <AccountInfo  className="card-body !px-2.5" internId={internId} intern={intern} taskStatus={taskStatus}/>
                    <div className="card-body !px-2.5 !py-0">
                        <Nav className="flex flex-wrap w-full text-sm font-medium text-center nav-tabs">
                            <Nav.Item eventKey="overviewTabs" className="group">
                                <a href="#!" data-tab-toggle data-target="overviewTabs" className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border-b border-transparent group-[.active]:text-custom-500 dark:group-[.active]:text-custom-500 group-[.active]:border-b-custom-500 dark:group-[.active]:border-b-custom-500 hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]">Overview</a>
                            </Nav.Item>
                            <Nav.Item eventKey="documentsTabs" className="group">
                                <a href="#!" data-tab-toggle data-target="documentsTabs" className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border-b border-transparent group-[.active]:text-custom-500 dark:group-[.active]:text-custom-500 group-[.active]:border-b-custom-500 dark:group-[.active]:border-b-custom-500 hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]">Documents</a>
                            </Nav.Item>
                            <Nav.Item eventKey="projectsTabs" className="group">
                                <a href="#!" data-tab-toggle data-target="projectsTabs" className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border-b border-transparent group-[.active]:text-custom-500 dark:group-[.active]:text-custom-500 group-[.active]:border-b-custom-500 dark:group-[.active]:border-b-custom-500 hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]">Tasks</a>
                            </Nav.Item>
                        </Nav>
                    </div>
                </div>
                <Tab.Content className="tab-content">
                    <Tab.Pane eventKey="overviewTabs" id="overviewTabs">
                        <OverviewTabs intern={intern} taskStatus={taskStatus}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="documentsTabs" id="documentsTabs">
                        <Documents internId={internId} parrainId={parrainId} documents={documents} getAllDocumentsReceived={getAllDocumentsReceived} getAllDocumentsSended={getAllDocumentsSended}  docsReceived={docsReceived}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="projectsTabs" id="projectsTabs">
                        <ProjectsTabs internId={internId} getNumberOfTasksById={getNumberOfTasksById} />
                    </Tab.Pane>
                  
                </Tab.Content>
            </Tab.Container>
        </React.Fragment>
    );
}

export default Account;