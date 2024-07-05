import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {format} from 'timeago.js'
import getToken from "helpers/jwt-token-access/tokenAccess";
import {GET_PARRAIN_BY_ID} from "services/parrainsAPIs/parrainsAPIs";
import {GET_LATEST_MESSAGES, GET_CHAT_MESSAGES} from "services/chatApis/chatApis";
function ChatCard({item, Chat_Box_Username, userChatOpen, internId, parrainId, ParrainImage, ReceiveMessage, online}:any) {

    const [parrain, setParrain]= useState<any>();
    const [latestMessage, setLatestMessage] = useState<any>();
    const [messages, setMessages] = useState<any>([]);
    const [latestMessages, setLatestMessages] = useState<any>([]);
    
    async function getParrainById(parrainId:string) {
        try {
            const response = await fetch(`${GET_PARRAIN_BY_ID+parrainId}`,{
              headers: {
                'authorization': `Bearer ${getToken()}`, 
            },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch intern');
            }
            const data = await response.json();
           
            setParrain(data);
           
        } catch (error) {
            console.error('Error fetching intern:', error);
            throw error;
        }
    }

    // async function getLatest message from api
    async function getLatestMessage(chatId:any) {
        try {
            const response = await fetch(`${GET_LATEST_MESSAGES+chatId}`,{
              headers: {
                'authorization': `Bearer ${getToken()}`, 
            },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            const data = await response.json();
            if (data?.length > 0) {
               
                setLatestMessage(data[0]);
            } else {
                console.log('No latest message found.');
            }
        } catch (error) {
            console.error('Error fetching intern:', error);
            throw error;
        }
    }



    // Fetch messages of a chat
const fetchMessages = async (chatId:any) => {
    try {
        const response = await fetch(`${GET_CHAT_MESSAGES+chatId}`,{
          headers: {
            'authorization': `Bearer ${getToken()}`, 
          },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
       
        const messages = await response.json(); // Parse the JSON response
        if (messages.length > 0) {
            setMessages(messages);
        }
       
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};

    


    useEffect(() => {
      
        getParrainById(parrainId);
        getLatestMessage(item.id);
        fetchMessages(item.id);

    }, [parrainId]);


    useEffect(()=>{
      if(ReceiveMessage!==null && ReceiveMessage.chatId===item.id){
          setLatestMessage(ReceiveMessage);
          setLatestMessages([...latestMessages, ReceiveMessage]);
          
      }
    },[ReceiveMessage])



  return (
    <>
   
      <li>
      {parrain &&
        <Link
          to="#!"
          className={`flex items-center gap-3 px-5 py-2 [&.active]:bg-slate-50 dark:[&.active]:bg-zink-600 group/item ${
            online ? "online" : "offline"
          } ${Chat_Box_Username === item.name && "active"}`}
          onClick={() => userChatOpen(item,parrain, messages, ParrainImage, latestMessages)}
        >
          <div className="relative flex items-center justify-center font-semibold rounded-full text-slate-500 dark:text-zink-200 size-9 bg-slate-100 dark:bg-zink-600">
            {/* images of persones */}
            {ParrainImage != "default.jpg"  ? (
            <img src={ParrainImage} alt="" className="rounded-full h-9" />
            ) :  (
              parrain.fname
            .split(" ")
                .map((word:any) => word.charAt(0))
                .join("")
            )}

            <span className="absolute bottom-0 ltr:right-0 rtl:left-0 size-2.5 border-2 border-white dark:border-zink-700 rounded-full group-[.online]/item:bg-green-400 group-[.offline]/item:bg-slate-400 dark:group-[.offline]/item:bg-zink-500 bg-red-500"></span>
          </div>
          <div className="overflow-hidden grow">
            <h6 className="mb-1">{parrain.fname + ' ' + parrain.lname}</h6>
            {latestMessage ? (
              <p className="text-xs truncate text-slate-500 dark:text-zink-200">
                {latestMessage.text}
              </p>
            ) : (
              <p className="text-xs truncate text-slate-500 dark:text-zink-200">
                {item.designation}
              </p>
            )}
          </div>
          {latestMessage && (
            <div className="self-start shrink-0 text-slate-500 dark:text-zink-200">
              <small>{format(latestMessage.createdAt)}</small>
            </div>
          )}
        </Link>
        }
      </li>
      
    </>
  );
}

export default ChatCard;
