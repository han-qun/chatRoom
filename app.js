const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
let users = [];

server.listen(8080);

//将public设置为静态资源目录
app.use(require('express').static(__dirname+'/public',{index:'index.html'}));

io.on('connection',socket=>{
    socket.on('login',data=>{
        //find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
        let user = users.find(function (item) {
            return item.userName === data.userName;
        });
        if(user){
            socket.emit('loginErr',{msg:'用户名已存在'})
        }else {
            users.push(data);
            socket.emit('loginSuccess',data);
            socket.userName =data.userName;
            socket.avatar = data.avatar;
            //向所有用户展示谁加入了聊天室
            io.emit('enterInfo',data);     //io.emit向所有用户发送消息

            //向所有用户展示在线人员列表
            io.emit('userList',users);
        }
    })

    //监听用户断开连接
    socket.on('disconnect',() => {
        let index = users.findIndex(function (item) {
            return socket.userName === item.userName;
        });
        users.splice(index,1);
        io.emit('leaveInfo',socket.userName);
        io.emit('userList',users);
    })

    //监听用户发送消息
    socket.on('sendInfo',data =>{
        io.emit('receiveInfo',data);         //将接收到的消息发送给所有人
    })

    //监听用户发送图片
    socket.on('sendImg',data =>{
        io.emit('receiveImg',data);         //将接收到的消息发送给所有人
    })
});