import React, { useEffect, useState } from 'react';
import BreadCrumb from 'Common/BreadCrumb';

import Widgets from './Widgets';

import TrafficResources from './TrafficResources';
import withRouter from 'Common/withRouter';
import { useNavigate } from 'react-router-dom';
import getToken from 'helpers/jwt-token-access/tokenAccess';

import {NUMBER_OF_TASKS_BY_ID, TASK_COMPLETION_PERCENTAGE, TASK_STATUS_PERCENTAGE} from "services/tasksAPIs/tasksAPIs"
//i18n
import { withTranslation } from "react-i18next";

import {COUNT_CHATS} from "services/chatApis/chatApis"


interface TaskStatus {
    [key: string]: number;
}

const Ecommerce = () => {

    const navigate = useNavigate();
    useEffect(() => navigate("/dashboard"), [navigate]);

    const [intern, setIntern] = useState<any>();
    const authUser = localStorage.getItem("authUser");

    const [taskStatus, setTaskStatus] = useState<TaskStatus>();
    const [receivedMessagesCount, setReceivedMessagesCount] = useState<number>(0);
    const [completedTasks, setCompletedTasks] = useState<number>(0);
    const [tasksPercentage, setTasksPercentage] = useState<any>(0);


    useEffect(()=>{

        if (authUser) {
            // Parse the JSON string to convert it back to an object
            const authUserData = JSON.parse(authUser);
            setIntern(authUserData);
            
        } else {
            console.log("authUser not found in localStorage");
        }
    
    },[authUser])




    useEffect(() => {

        async function getNumberOfTasksById(internId:string) {
            try {
              
                const response = await fetch(`${NUMBER_OF_TASKS_BY_ID+internId}`,{
                    headers: {
                        'authorization': `Bearer ${getToken()}`, 
                    },
                });
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


        const fetchReceivedMessagesCount = async (internId:string) => {
            try {
                const response = await fetch(`${COUNT_CHATS+internId}`,{
                    
                    headers: {
                        'authorization': `Bearer ${getToken()}`, 
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch received messages count');
                }
                const data = await response.json();
                if (typeof data === 'number') {
                  setReceivedMessagesCount(data);
                  console.log(data);
              } else {
                  throw new Error('Received invalid data format');
              }
              
            } catch (error) {
                console.error('Error fetching received messages count:', error);
            }
        };




        const fetchCompletedTasksPercentage = async (internId:string) => {
            try {
                const response = await fetch(`${TASK_COMPLETION_PERCENTAGE+internId}`,{
                    headers: {
                        'authorization': `Bearer ${getToken()}`, 
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch received messages count');
                }
                const data = await response.json();
                if (typeof data === 'number') {
                  setCompletedTasks(data);
                  console.log(data);
              } else {
                  throw new Error('Received invalid data format');
              }
              
            } catch (error) {
                console.error('Error fetching received messages count:', error);
            }
          };



          const fetchTasksPercentage = async (internId:string) => {
            try {
                const response = await fetch(`${TASK_STATUS_PERCENTAGE+internId}`,{
                    headers: {
                        'authorization': `Bearer ${getToken()}`, 
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch received messages count');
                }
                const data = await response.json();
               
                  setTasksPercentage(data);
                  console.log(data);
             
              
            } catch (error) {
                console.error('Error fetching received messages count:', error);
            }
          };





        if (intern) {
            // call functions
            console.log(intern.internId);
            getNumberOfTasksById(intern.internId);
            fetchReceivedMessagesCount(intern.internId);
            fetchCompletedTasksPercentage(intern.internId);
            fetchTasksPercentage(intern.internId);

        }
    },[intern])

    return (
        <React.Fragment>
            <BreadCrumb title='Dashboard' pageTitle='Dashboards' />
            <div className="grid grid-cols-12 gap-x-5">
                {/* <WelcomeWidget /> */}
                <Widgets taskStatus={taskStatus} receivedMessagesCount={receivedMessagesCount} />
                <TrafficResources taskStatus={taskStatus} completedTasks={completedTasks} tasksPercentage={tasksPercentage}/>
                {/* <OrderStatistics /> */}
                
                {/* <SalesRevenue /> */}
                
                {/* <ProductsOrders />
                <CustomerService /> */}
                {/* <SalesMonth />
                <TopSellingProducts />
                <Audience /> */}
            </div>
        </React.Fragment>
    );
};

export default withRouter(withTranslation()(Ecommerce));

