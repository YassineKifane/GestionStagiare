import React, { useEffect, useRef, useState } from "react";

// Images
import logoSm from "assets/images/logo-sm.png";
import { format } from "timeago.js";

import userDummayImage from "assets/images/users/user-dummy-img.jpg";
import SimpleBar from "simplebar-react";
import getToken from "helpers/jwt-token-access/tokenAccess";

import { GET_USER_CHAT, POST_USER_MESSAGE } from "services/chatApis/chatApis";

// Icons
import {
  MessagesSquare,
  ChevronsLeft,
  X,
  MoreVertical,
  Phone,
  Mail,
  PanelRightOpen,
  Send,
  Crown,
} from "lucide-react";
import Tab from "Common/Components/Tab/Tab";
import { Nav } from "Common/Components/Tab/Nav";
import { Link } from "react-router-dom";
import { Dropdown } from "Common/Components/Dropdown";

// react-redux
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import Drawer from "Common/Components/Drawer";

import ChatCard from "./ChatCard";
import axios from "axios";

import { io } from "socket.io-client";

const Chat = () => {
  const [parrainId, setParrainId] = useState();
  const [internId, setInternId] = useState();
  const authUser = localStorage.getItem("authUser");
  const ParrainImage = localStorage.getItem("parrainImage");
  const [userImage, setUserImage] = useState<any>();
  const [parrainPic, setParrainPic] = useState<any>();
  const [OnlineUsers, setOnlineUsers] = useState([]);

  const [socket, setSocket] = useState<any>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_SOCKET_URL}`);
    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (authUser && ParrainImage) {
      // Parse the JSON string to convert it back to an object
      const authUserData = JSON.parse(authUser);

      setParrainId(authUserData.parrainId);
      setInternId(authUserData.internId);
      setUserImage(authUserData.img);
      setParrainPic(ParrainImage);
    } else {
      console.log("authUser not found in localStorage");
    }
  }, [authUser]);

  useEffect(() => {
    if (internId) {
      socketRef.current.emit("new-user-add", internId);
      socketRef.current.on("get-users", (users: any) => {
        setOnlineUsers(users);

        // console.log(users)
      });
    }
  }, [internId]);

  const [chats, setChats] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  // Recent Chats
  const [recentChatslist, setRecentChatslist] = useState<any>(chats);

  // Fetch all chats of a user
  const fetchChats = async (userId: any) => {
    try {
      const response = await axios.get(`${GET_USER_CHAT + userId}`, {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      });
      setChats(response);
      setRecentChatslist(response);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  // Create a message
  const createMessage = async (chatId: any, senderId: any, text: any) => {
    try {
      const response = await axios.post(
        `${POST_USER_MESSAGE}`,
        {
          chatId,
          senderId,
          text,
        },
        {
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  useEffect(() => {
    fetchChats(internId);
  }, [internId, chats]);

  const [Chat_Box_Username, setChat_Box_Username] = useState<any>(
    "Select a Conversation"
  );
  const [Chat_Box_Image, setChat_Box_Image] = useState<any>();
  const [Chat_Box_Desiganation, setChat_Box_Desiganation] = useState<any>(
    "To Start Sending messages..."
  );
  const [currentRoomId, setCurrentRoomId] = useState<any>(1);
  const [currentParrain, setcurrentParrain] = useState<any>();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleToggleDrawer = () => setIsOpen(!isOpen);

  // Content
  const handlechatbotList = (name: any) => {
    const chartlist = document.getElementById("chartlist");
    const botlist = document.getElementById("botlist");
    if (name === "bot") {
      chartlist?.classList.remove("active");
      botlist?.classList.add("active");
    } else {
      botlist?.classList.remove("active");
      chartlist?.classList.add("active");
    }
  };

  const selectDataList = createSelector(
    (state: any) => state.Chat,
    (state) => ({
      dataList: state.chats,
    })
  );

  const { dataList } = useSelector(selectDataList);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    setData(dataList);
  }, [dataList]);

  // Add Message
  const [curMessage, setcurMessage] = useState<string>("");
  const addMessage = async () => {
    if (curMessage !== "") {
      const message: any = {
        chatId: currentRoomId,
        text: curMessage,
        senderId: internId,
      };

      //send message to db
      const Newmessage = await createMessage(
        message.chatId,
        message.senderId,
        message.text
      );
      setDisplayMessages([...DisplayMessages, Newmessage]);

      // send message to socket server
      socketRef.current.emit("send-message", {
        chatId: currentRoomId,
        text: curMessage,
        senderId: internId,
        receiverId: currentParrain.parrainId,
      });
    }
    setcurMessage("");
  };

  const onKeyPress = (e: any) => {
    const { key, value } = e;
    if (key === "Enter") {
      e.preventDefault();
      setcurMessage(value);
      addMessage();
    }
  };

  const [DisplayMessages, setDisplayMessages] = useState<any>([]);

  //Use For Chat Box
  const userChatOpen = (
    item: any,
    intern: any,
    messages: any,
    ParrainImage: any,
    latestMessages: any
  ) => {
    setChat_Box_Username(intern.fname);
    setChat_Box_Image(ParrainImage);
    setChat_Box_Desiganation(intern.speciality);
    setCurrentRoomId(item._id);
    setcurrentParrain(intern);

    if (latestMessages) {
      const updatedMessages = [...messages, ...latestMessages];

      // Set the updated messages array
      setDisplayMessages(updatedMessages);

      console.log("updated messages :");
      console.log(updatedMessages);
    } else {
      // If ReceiveMessage is empty or contains errors, set the existing messages
      setDisplayMessages(messages);
    }

    // dispatch(onGetChat(item._id));

    document.querySelector(".menu-content")?.classList.add("hidden");
    document.querySelector(".chat-content")?.classList.add("show");
  };

  const [ReceiveMessage, setReceiveMessage] = useState<any>(null);

  useEffect(() => {
    socketRef.current.on("recieve-message", (data: any) => {
      console.log("new message : ", data);
      setReceiveMessage(data);
    });
  }, []);

  useEffect(() => {
    if (ReceiveMessage !== null && ReceiveMessage.chatId === currentRoomId) {
      console.log("new message : ", ReceiveMessage);
      setDisplayMessages([...DisplayMessages, ReceiveMessage]);
    }
  }, [ReceiveMessage]);

  // Copy Message
  const handleCopyClick = (ele: any) => {
    const copy = ele.text;

    if (copy) {
      navigator.clipboard.writeText(copy);
    }

    const copyClipboardElement = document.getElementById("copyClipBoard");
    if (copyClipboardElement) {
      copyClipboardElement.classList.remove("hidden");
      setTimeout(() => {
        copyClipboardElement.classList.add("hidden");
      }, 1000);
    }
  };

  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (chatRef.current?.el) {
      chatRef.current.getScrollElement().scrollTop =
        chatRef.current.getScrollElement().scrollHeight;
    }
  }, [DisplayMessages]);

  // function to check online users

  const checkOnlineStatus = (chat: any) => {
    const chatMember = chat.members.find((member: any) => member !== internId);
    const online = OnlineUsers.find((user: any) => user.userId === chatMember);
    return online ? true : false;
  };

  const filterRecentChatsData = (e: any) => {
    const search = e.target.value.toLowerCase();
    const filteredData = recentChatslist.filter((item: any) => {
      // Check if any member ID contains the search query
      const memberMatches = item.members.some((member: string) =>
        member.toLowerCase().includes(search)
      );
      return !search || memberMatches;
    });

    // console.log(filteredData);

    setChats(filteredData);
  };

  document.title = `Chat | OCP`;

  return (
    <React.Fragment>
      <div className="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto relative">
        <div className="flex gap-5 mt-5">
          <Tab.Container defaultActiveKey="mainChatList">
            <div className="fixed inset-x-0 bottom-12 2xl:w-20 shrink-0 xl:relative z-[20] text-center xl:bottom-auto">
              <div className="xl:min-h-[calc(100vh_-_theme('height.header')_*_2.4)] inline-block card xl:h-[calc(100%_-_theme('spacing.5'))] shadow-lg xl:shadow-md">
                <div className="flex items-center h-full p-2 2xl:p-4 xl:flex-col">
                  <Link to="#!" className="hidden xl:block">
                    <img src={logoSm} alt="" className="h-8 mx-auto" />
                  </Link>
                  {/* mesage nav icon */}
                  <Nav className="flex gap-2 my-auto text-center xl:pt-8 xl:flex-col nav-tabs">
                    <Nav.Item
                      eventKey="mainChatList"
                      className="group/item tabs chatTab"
                    >
                      <Link
                        to="#!"
                        className="inline-flex items-center justify-center size-12 transition-all duration-200 ease-linear rounded-md mainChatList"
                      >
                        <MessagesSquare
                          className="mx-auto transition-all size-5 duration-200 ease-linear fill-slate-100 text-slate-500 dark:text-zink-200 dark:fill-zink-500 group-hover/item:text-custom-500 dark:group-hover/item:text-custom-500 group-[.active]/item:fill-custom-100 dark:group-[.active]/item:fill-custom-500/20 group-[.active]/item:text-custom-500 dark:group-[.active]/item:text-custom-500"
                          onClick={() => {
                            handlechatbotList("chat");
                          }}
                        />
                      </Link>
                    </Nav.Item>
                  </Nav>
                  <ul className="flex items-center gap-2 my-auto text-center xl:mb-0 xl:mt-auto xl:pt-4 xl:flex-col">
                    <li className="hidden md:block">
                      <div className="relative dropdown">
                        <Link
                          to="#!"
                          type="button"
                          className="inline-flex items-center justify-center size-12 transition-all duration-200 ease-linear bg-pink-100 rounded-md group/item dropdown-toggle dark:bg-pink-500/20"
                          id="profilDropdown"
                          data-bs-toggle="dropdown"
                        >
                          <img
                            src={userImage}
                            alt=""
                            className="h-12 rounded-md"
                          />
                        </Link>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="block w-full xl:block xl:w-80 shrink-0 menu-content">
              <div className="h-[calc(100vh_-_theme('spacing.10')_*_6)] xl:min-h-[calc(100vh_-_theme('height.header')_*_2.4)] card xl:h-[calc(100%_-_theme('spacing.5'))]">
                <div className="flex flex-col h-full">
                  {/* chat panel */}
                  <Tab.Content className="tab-content">
                    <Tab.Pane
                      eventKey="mainChatList"
                      className="tab-pane"
                      id="mainChatList"
                    >
                      <div className="card-body">
                        <div className="flex items-center gap-3">
                          <button className="inline-flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md shrink-0 bg-slate-100 text-slate-500 dark:bg-zink-600 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500">
                            <ChevronsLeft className="size-4 mx-auto" />
                          </button>
                          <h6 className="text-15 grow">Chats</h6>
                        </div>
                        <div className="relative mt-5">
                          <input
                            type="text"
                            className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                            placeholder="Search By CIN ..."
                            autoComplete="off"
                            onChange={(e) => filterRecentChatsData(e)}
                          />
                        </div>
                      </div>
                      <SimpleBar className="max-h-[calc(100vh_-_380px)] xl:max-h-[calc(100vh_-_300px)]">
                        <ul className="flex flex-col gap-1" id="chatList">
                          <li className="px-5">
                            <p className="mb-1 text-slate-500 dark:text-zink-200">
                              Recent Chats
                            </p>
                          </li>
                          {(chats || []).map((item: any, key: number) => (
                            <React.Fragment key={key}>
                              {key === 3 && (
                                <li className="px-5">
                                  <p className="mb-1 text-slate-500 dark:text-zink-200">
                                    All Conversion
                                  </p>
                                </li>
                              )}

                              <ChatCard
                                item={item}
                                Chat_Box_Username={Chat_Box_Username}
                                userChatOpen={userChatOpen}
                                internId={internId}
                                parrainId={parrainId}
                                ParrainImage={ParrainImage}
                                ReceiveMessage={ReceiveMessage}
                                online={checkOnlineStatus(item)}
                              />
                            </React.Fragment>
                          ))}

                          {!chats.length && (
                            <li className="px-5">
                              <p className="mb-1 text-slate-500 dark:text-zink-200">
                                No Conversion Found
                              </p>
                            </li>
                          )}
                        </ul>
                      </SimpleBar>
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </div>
            </div>
          </Tab.Container>
          <div
            id="chartlist"
            className={`h-[calc(100vh_-_theme('spacing.10')_*_6)] xl:min-h-[calc(100vh_-_theme('height.header')_*_2.4)] card w-full hidden [&.show]:block [&.active]:xl:block chat-content active`}
          >
            <div
              className="px-4 py-3 text-sm unreadConversations-alert text-yellow-500 border border-transparent rounded-md bg-yellow-50 dark:bg-yellow-400/20 hidden"
              id="copyClipBoard"
            >
              <span className="font-bold">Message Copied</span>
            </div>
            <div className="relative flex flex-col h-full">
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <button className="inline-flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md shrink-0 bg-slate-100 text-slate-500 dark:bg-zink-600 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500">
                    <ChevronsLeft className="size-4 mx-auto" />
                  </button>
                  <Link
                    to="#!"
                    data-drawer-target="drawerEnd"
                    className="flex items-center gap-3 ltr:mr-auto rtl:ml-auto shrink-0"
                    id="userChatProfile"
                  >
                    <div className="size-10 rounded-full bg-slate-100 dark:bg-zink-600">
                      {Chat_Box_Image === undefined ? (
                        <img
                          src={userDummayImage}
                          className="h-10 rounded-full"
                          alt=""
                        />
                      ) : (
                        <img
                          src={Chat_Box_Image}
                          className="h-10 rounded-full"
                          alt=""
                        />
                      )}
                    </div>
                    <div>
                      <h6> {Chat_Box_Username}</h6>
                      <p className="text-sm text-slate-500 dark:text-zink-200">
                        {Chat_Box_Desiganation}
                      </p>
                    </div>
                  </Link>
                  <ul className="flex items-center">
                    <li className="hidden md:block">
                      <Link
                        to="#!"
                        data-drawer-target="drawerEnd"
                        className="inline-flex items-center justify-center size-10 transition-all duration-200 ease-linear rounded-md group/item"
                        onClick={handleToggleDrawer}
                      >
                        <PanelRightOpen className="size-4 mx-auto transition-all duration-200 ease-linear fill-slate-100 dark:fill-zink-600 dark:text-zink-200 text-slate-500 group-hover/item:text-custom-500 group-hover/item:fill-custom-100 dark:group-hover/item:fill-custom-500/20 dark:group-hover/item:text-custom-500 group-[.active]/item:hidden block" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="relative bg-slate-50 dark:bg-zink-600/50 grow">
                <div
                  className="absolute inset-x-0 top-0 z-10 hidden transition-all duration-200 ease-linear bg-white border-y border-slate-200 dark:bg-zink-700 dark:border-zink-500"
                  id="searchChat"
                >
                  <input
                    type="text"
                    className="w-full px-5 py-2 focus:outline-none"
                    placeholder="Search for ..."
                    autoComplete="off"
                  />
                </div>
                <SimpleBar
                  ref={chatRef}
                  className="h-[calc(100vh_-_410px)] xl:h-[calc(100vh_-_330px)]"
                >
                  {DisplayMessages && (
                    <ul className="flex flex-col gap-5 list-none card-body">
                      {DisplayMessages.map((msg: any, key: number) => (
                        <React.Fragment key={key}>
                          <li
                            className={`flex chat-message group/item [&.right]:justify-end ${
                              msg.senderId === internId && "right "
                            }`}
                            key={key}
                          >
                            <div className="flex gap-3">
                              <div className="grow group-[.right]/item:order-2 flex flex-col gap-3">
                                <div className="flex gap-3">
                                  <div
                                    className={`relative p-4 ${
                                      msg.senderId === internId
                                        ? "bg-green-200"
                                        : "bg-white"
                                    } dark:bg-zink-700 rounded-md ltr:rounded-bl-none rtl:rounded-br-none shadow-sm 2xl:max-w-sm ltr:group-[.right]/item:rounded-br-none rtl:group-[.right]/item:rounded-bl-none ltr:group-[.right]/item:rounded-bl-md rtl:group-[.right]/item:rounded-br-md group-[.right]/item:order-2`}
                                  >
                                    {/* messages conversation */}
                                    {msg.text}
                                    <br />
                                    <div className="text-xs text-slate-500 dark:text-zink-200">
                                      {format(msg.createdAt)}
                                    </div>
                                  </div>
                                  {/* message menu (copy) */}
                                  <Dropdown className="relative transition-all duration-200 ease-linear opacity-0 dropdown shrink-0 group-hover/item:opacity-100 group-[.right]/item:order-1">
                                    <Dropdown.Trigger
                                      type="button"
                                      className="dropdown-toggle"
                                      id="dropdownMenuButton"
                                      data-bs-toggle="dropdown"
                                    >
                                      <MoreVertical className="inline-block size-4 ml-1" />
                                    </Dropdown.Trigger>

                                    <Dropdown.Content
                                      placement={
                                        msg.senderId === internId
                                          ? msg.length / 2 <= key
                                            ? "top-end"
                                            : "right-end"
                                          : msg.length / 2 <= key
                                          ? "top-start"
                                          : "start-end"
                                      }
                                      className="absolute z-50 py-2 mt-1 ltr:text-left rtl:text-right list-none bg-white rounded-md shadow-md dropdown-menu min-w-[10rem] dark:bg-zink-600"
                                      aria-labelledby="dropdownMenuButton"
                                    >
                                      <li>
                                        <Link
                                          className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200"
                                          to="#!"
                                          onClick={() => handleCopyClick(msg)}
                                        >
                                          Copy
                                        </Link>
                                      </li>
                                    </Dropdown.Content>
                                  </Dropdown>
                                </div>
                              </div>
                            </div>
                          </li>
                        </React.Fragment>
                      ))}
                    </ul>
                  )}
                </SimpleBar>
              </div>

              {/* message send box */}

              {Chat_Box_Username === "Select a Conversation" ? null : (
                <div className="card-body">
                  <div className="flex items-center gap-2">
                    <div className="grow">
                      <input
                        type="text"
                        id="inputText"
                        className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                        placeholder="Type your message here ..."
                        value={curMessage}
                        onKeyDown={onKeyPress}
                        onChange={(e) => setcurMessage(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                        disabled={!curMessage}
                        onClick={addMessage}
                      >
                        <Send className="inline-block size-4 mr-1 align-middle" />{" "}
                        <span className="align-middle">Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {currentParrain && (
        <Drawer
          show={isOpen}
          onHide={handleToggleDrawer}
          id="drawerEnd"
          drawer-end="true"
          className="fixed inset-y-0 flex flex-col w-full transition-transform duration-300 ease-in-out transform bg-white shadow ltr:right-0 rtl:left-0 md:w-80 z-drawer dark:bg-zink-600"
        >
          <div className="h-full p-4 overflow-y-auto">
            <div>
              <div className="flex items-center gap-3">
                <button
                  id="closeChatRightSidebar"
                  className="inline-flex items-center justify-center h-8 transition-all duration-200 ease-linear rounded-md shrink-0 text-slate-500 hover:text-custom-500"
                >
                  <ChevronsLeft className="size-4 mx-auto" />
                </button>
                <h6 className="text-15 grow">Profile</h6>
                <Drawer.Header
                  data-drawer-close="drawerEnd"
                  className="inline-flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md shrink-0 bg-slate-100 text-slate-500 hover:text-red-500 dark:bg-zink-600 dark:text-zink-200 dark:hover:text-red-500"
                >
                  <X className="size-4 mx-auto"></X>
                </Drawer.Header>
              </div>
              <Drawer.Body>
                <div>
                  <div className="text-center">
                    <div className="size-20 mx-auto mt-8 rounded-full bg-slate-100 dark:bg-zink-600">
                      <img
                        src={Chat_Box_Image}
                        alt=""
                        className="h-20 rounded-full"
                      />
                    </div>
                    <h5 className="mt-4 text-16">{Chat_Box_Username}</h5>
                    <p className="text-slate-500 dark:text-zink-200">
                      {Chat_Box_Desiganation}
                    </p>
                  </div>
                  <div className="mt-5">
                    <p className="mb-4 text-slate-500 dark:text-zink-200">
                      Personal Information
                    </p>
                    <h6 className="mb-3 font-medium">
                      <Phone className="inline-block size-4 ltr:mr-1 rtl:ml-1 text-slate-500 dark:text-zink-200" />{" "}
                      <span className="align-middle">
                        {currentParrain.phone}
                      </span>
                    </h6>
                    <h6 className="mb-3 font-medium">
                      <Mail className="inline-block size-4 ltr:mr-1 rtl:ml-1 text-slate-500 dark:text-zink-200" />{" "}
                      <span className="align-middle">
                        {currentParrain.email}
                      </span>
                    </h6>
                    <h6 className="font-medium">
                      <Crown className="inline-block size-4 ltr:mr-1 rtl:ml-1 text-slate-500 dark:text-zink-200" />{" "}
                      <span className="align-middle">
                        {currentParrain.service}
                      </span>
                    </h6>
                  </div>
                </div>
              </Drawer.Body>
            </div>
          </div>
        </Drawer>
      )}
    </React.Fragment>
  );
};

export default Chat;
