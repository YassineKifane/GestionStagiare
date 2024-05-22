import React, { useEffect, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import Widgets from "./Widgets";
import Satisfaction from "./Satisfaction";
import TrafficSource from "./TrafficSource";
import getToken from "helpers/jwt-token-access/tokenAccess";
import {COUNT_DOCUMENTS, GET_DOCS_TYPES} from "services/documentsAPIs/documentsAPIs";
import {GET_TASKS_PERCENTAGE, GET_TOTAL_TASKS} from "services/tasksAPIs/tasksAPIs";
import {COUNT_INTERNS} from "services/internsAPIs/internsAPIs";
import {COUNT_CHATS} from "services/chatApis/chatApis";


const Analytics = () => {
  const [receivedMessagesCount, setReceivedMessagesCount] = useState<number>(0);
  const [totalInterns, setTotalInterns] = useState<number>(0);
  const [totalDocuments, setTotalDocuments] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [docsTypes, setDocsTypes] = useState<any>();
  const [token, setToken] = useState<any>();

  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [parrainId, setParrainId] = useState();
  const authUser = localStorage.getItem("authUser");

  useEffect(() => {
    if (authUser) {
      setToken(getToken);
      // Parse the JSON string to convert it back to an object
      const authUserData = JSON.parse(authUser);
      setParrainId(authUserData.parrainId);
    } else {
      console.log("authUser not found in localStorage");
    }
  }, [authUser]);

  useEffect(() => {
    const fetchTotalInterns = async () => {
      try {
        const response = await fetch(
          `${COUNT_INTERNS+parrainId}`,
          {
            headers: {
              authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch received messages count");
        }
        const data = await response.json();
        if (typeof data === "number") {
          setTotalInterns(data);
          console.log(data);
        } else {
          throw new Error("Received invalid data format");
        }
      } catch (error) {
        console.error("Error fetching received messages count:", error);
      }
    };

    const fetchReceivedMessagesCount = async () => {
      try {
        const response = await fetch(
          `${COUNT_CHATS+parrainId}`,
          {
            headers: {
              authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch received messages count");
        }
        const data = await response.json();
        if (typeof data === "number") {
          setReceivedMessagesCount(data);
          console.log(data);
        } else {
          throw new Error("Received invalid data format");
        }
      } catch (error) {
        console.error("Error fetching received messages count:", error);
      }
    };

    const fetchReceivedDocumentsCount = async () => {
      try {
        const response = await fetch(
          `${COUNT_DOCUMENTS+parrainId}`,
          {
            headers: {
              authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch received messages count");
        }
        const data = await response.json();
        if (typeof data === "number") {
          setTotalDocuments(data);
          console.log(data);
        } else {
          throw new Error("Received invalid data format");
        }
      } catch (error) {
        console.error("Error fetching received messages count:", error);
      }
    };

    const fetchCompletedTasksPercentage = async () => {
      try {
        const response = await fetch(
          `${GET_TASKS_PERCENTAGE}`,
          {
            headers: {
              authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch received messages count");
        }
        const data = await response.json();
        if (typeof data === "number") {
          setCompletedTasks(data);
          console.log(data);
        } else {
          throw new Error("Received invalid data format");
        }
      } catch (error) {
        console.error("Error fetching received messages count:", error);
      }
    };

    const fetchTotalTasks = async () => {
      try {
        const response = await fetch(
          `${GET_TOTAL_TASKS+parrainId}`,
          {
            headers: {
              authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch received messages count");
        }
        const data = await response.json();
        if (typeof data === "number") {
          setTotalTasks(data);
          console.log(data);
        } else {
          throw new Error("Received invalid data format");
        }
      } catch (error) {
        console.error("Error fetching received messages count:", error);
      }
    };

    const fetchDocsTypes = async () => {
      try {
        const response = await fetch(
          `${GET_DOCS_TYPES}`,
          {
            headers: {
              authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch received messages count");
        }
        const data = await response.json();

        setDocsTypes(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching received messages count:", error);
      }
    };

    if (parrainId && token) {
      fetchReceivedMessagesCount();
      fetchTotalInterns();
      fetchReceivedDocumentsCount();
      fetchCompletedTasksPercentage();
      fetchTotalTasks();
      fetchDocsTypes();
    }
  }, [parrainId]);

  return (
    <React.Fragment>
      <React.Fragment>
        <BreadCrumb title="Analytics" pageTitle="Dashboards" />
        <div className="grid grid-cols-12 gap-x-5">
          <Widgets
            receivedMessagesCount={receivedMessagesCount}
            totalInterns={totalInterns}
            totalDocuments={totalDocuments}
            totalTasks={totalTasks}
          />

          <Satisfaction completedTasks={completedTasks} />
          <TrafficSource docsTypes={docsTypes} />
          {/* <DailyVisit /> */}
          {/* <Reports /> */}
          {/* <Subscription /> */}
        </div>
      </React.Fragment>
    </React.Fragment>
  );
};

export default Analytics;

{
  /* <Interaction />
        <LocationBased />
        <DailyVisit />
        <ProductsStatistics />
        <Reports />
        <MonthlyCampaign />
        */
}
