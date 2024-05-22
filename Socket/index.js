const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });

const io = require('socket.io')(process.env.SOCKET_PORT,{
    pingTimeout:60000,
    cors:{
        origin:[process.env.CLIENT_BASE_URL],
        methods:["GET","POST"]
    }
});

let activeUsers = [];
io.on("connection",(socket)=>{
    //add new user
    socket.on("new-user-add",(newUserId)=>{
        //if user is not added previously
        if(!activeUsers.some((user)=>user.userId === newUserId)){
            activeUsers.push({
                userId:newUserId,
                socketId:socket.id
            });
        }
        console.log("Connected users",activeUsers);
        io.emit("get-users",activeUsers);
    })



    socket.on("disconnect",()=>{
        activeUsers = activeUsers.filter((user)=>user.socketId !== socket.id);
        // console.log("User Disconnected", activeUsers);
        io.emit("get-users", activeUsers);
    })
    
    
        //send message
        socket.on("send-message",(data)=>{
            const {receiverId} = data;
            const user = activeUsers.find((user)=>user.userId === receiverId);
            console.log("Sending from socket to :",receiverId)
            console.log("Data: ",data)
            if(user){
                io.to(user.socketId).emit("recieve-message",data);
            }
        })

})

