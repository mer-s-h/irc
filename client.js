
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const io = require('socket.io-client');

const socket = io("ws://localhost:3000");   // ici le port

var nickname;
var room = "global";

// display your message

socket.on("msg", (msg) => {
    console.log(msg);
})

// choose your nickname

rl.question("Please enter a nickname: ", (username) => {
    nickname = username;
    socket.emit('nickname', username);
    // rl.prompt(true);
});

// get what you write

rl.on('line', function (line) {
    socket.emit("msgclient", line)
});

socket.on("change", (change) => {
    console.log(change);
})


socket.on("user", (liste) => {
    console.log(liste + "\n");
})


// socket.on("room_name", (salon) => {
//     room = salon;
//     socket.emit('create', salon);
// })

socket.on("room", (room)=>{
    console.log(room);
})


// socket.on("rooms", (room)=>{
//     console.log(room);
// })





