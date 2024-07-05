import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {format} from 'timeago.js'
import getToken from "helpers/jwt-token-access/tokenAccess";
import { GET_CHAT_MESSAGES, GET_LATEST_MESSAGES} from "services/chatApis/chatApis";
import {GET_INTERN_BY_ID} from "services/internsAPIs/internsAPIs";

function ChatCard({item, Chat_Box_Username, userChatOpen, parrainId, ReceiveMessage, online, sendedMssg}:any) {

    const [intern, setIntern]= useState<any>();
    const [latestMessage, setLatestMessage] = useState<any>();
    const [latestMessages, setLatestMessages] = useState<any>([]);
    const [messages, setMessages] = useState<any>([]);
    
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
                'authorization': `Bearer ${getToken()}`, // Include the token in the Authorization header
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
            'authorization': `Bearer ${getToken()}`, // Include the token in the Authorization header
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

const [isBold, setIsBold] = useState(false);
    
useEffect(()=>{
  if(ReceiveMessage!==null && ReceiveMessage.chatId===item.id){
      setLatestMessage(ReceiveMessage);
      setIsBold(true);
      setLatestMessages([...latestMessages, ReceiveMessage]);
      
  }
},[ReceiveMessage])



useEffect(()=>{
   
  if(sendedMssg!==null && sendedMssg.chatId===item.id){
      setLatestMessage(sendedMssg);
      // setIsBold(true);
      setLatestMessages([...latestMessages, sendedMssg]);
    

  }
},[sendedMssg])


    useEffect(() => {
     
        const internId = item.members.find((id:any)=>id!==parrainId)
       
        
        getInternById(internId);
        getLatestMessage(item.id);
        fetchMessages(item.id);



    }, [parrainId]);

    let displayedText;


    const MAX_LENGTH = 12; // Maximum number of characters to display

    if(latestMessage){
      displayedText = latestMessage.text; // By default, use the entire text

  // If the text length exceeds the maximum length, truncate it and add "..."
    if (latestMessage.text.length > MAX_LENGTH) {
    displayedText = latestMessage.text.substring(0, MAX_LENGTH) + "...";
}

    }
    



  return (
    <>
   
      <li>
      {intern && latestMessages &&
        <Link
          to="#!"
          className={`flex items-center gap-3 px-5 py-2 [&.active]:bg-slate-50 dark:[&.active]:bg-zink-600 group/item ${
            online ? "online" : "offline"
          } ${Chat_Box_Username === item.name && "active"}`}
          onClick={() => userChatOpen(item,intern, messages, latestMessages, setIsBold)}
        >
          <div className="relative flex items-center justify-center font-semibold rounded-full text-slate-500 dark:text-zink-200 size-9 bg-slate-100 dark:bg-zink-600">
            {/* images of persones */}
            {intern.img !== ""  ? (
            <img src={intern.img} alt="" className="rounded-full h-9" />
            ) :  (
            intern.fname
            .split(" ")
                .map((word:any) => word.charAt(0))
                .join("")
            )}

            <span className="absolute bottom-0 ltr:right-0 rtl:left-0 size-2.5 border-2 border-white dark:border-zink-700 rounded-full group-[.online]/item:bg-green-400 group-[.offline]/item:bg-slate-400 dark:group-[.offline]/item:bg-zink-500 bg-red-500"></span>
          </div>
          <div className="overflow-hidden grow">
  <h6 className="mb-1">{intern.fname + ' ' + intern.lname}</h6>
  <div className="flex items-center">
  {displayedText ? (
    <div className="flex"> {/* Added flex class here */}
      <div className="relative mr-4">
        <p className="text-xs truncate text-slate-500 dark:text-zink-200">
          {isBold ? (
            <span className="font-bold">{displayedText}</span>
          ) : (
            displayedText
          )}
        </p>
      </div>
      {isBold && ( 
        <div className="w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-xs"> {/* Added height and fixed missing closing div */}
          {latestMessages.length}
        </div>
      )}
    </div>
  ) : (
    <p className="text-xs truncate text-slate-500 dark:text-zink-200">
      {item.designation}
    </p>
  )}
</div>

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
