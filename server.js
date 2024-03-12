const path=require('path')
const express=require('express')
const http=require('http')
const socketio=require('socket.io')
const formatMessage=require('./utils/message')
const {userJoin,getCurruntUser,userleft,getroomusers}=require('./utils/users')
const app=express()
const server=http.createServer(app);
const io=socketio(server)
const botName='ChatCord Bot'



const port=process.env.port||3000;
//app.use(helmet())
// app.use(express.static(path.join(__dirname,'public')))
app.use(express.static('public'))
io.on('connection',socket=>{

socket.on('joinRoom',({username,room})=>{
const user=userJoin(socket.id,username,room); 
    socket.join(user.room);
    socket.emit('message',formatMessage(botName,`Welcome to ${room}..`))
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`))
    //console.log(user.username)
    
    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getroomusers(user.room)
    })


})
    
    socket.on('chatMessage',(msg)=>{
        const user=getCurruntUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    })


    socket.on('disconnect',()=>{
        const user=userleft(socket.id)
        if(user)
{
        io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`))
    

    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getroomusers(user.room),
        //username:user.room
        
        
        
        
    }
    )
}
    })
})


server.listen(port,()=>console.log(`server running on ${port}`));