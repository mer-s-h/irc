const app = require("express")();
const server = require('http').createServer(app);

const io = require('socket.io')(server);
var last = [];
var client = [];
var nom = "";

io.on('connection', (socketClient) => {


    socketClient.on('nickname', (username) => {
        socketClient.username = username;
        client.push(socketClient.username);
        console.log(`${socketClient.username} has arrived !`);
    });

    socketClient.on("msgclient", (msg) => {

        var tab = msg.split(" ");

        for (let index = 1; index < tab.length; index++) {
            nom = nom + " " + tab[index]
            nom = nom.trim();
        }

        switch (tab[0]) {
            case '/nick':
                socketClient.broadcast.emit('change', `\n ${socketClient.username} changed name to ${nom} \n`);
                for (let index = 0; index < client.length; index++) {
                    if (client[index] == socketClient.username) {
                        client[index] = nom;
                    }
                };
                socketClient.username = nom;
                nom = "";
                break;

            case '/list':
                    socketClient.emit('room', io.socketClient.id);
                    // socketClient.emit('room', io.socketClient.adapter.rooms);
                    break;

            case '/create':
                socketClient.on('create',  (room) => {
                    room = nom;
                    socketClient.join(room);
                    socketClient.broadcast.emit("room_name", room)
                });

                break;
            case '/delete':

                break;
            case '/join':
                // socketClient.join('some room');

                break;
            case '/leave':
                // socketClient.leave('some room');

                break;
            case '/users':
                client.forEach(element => {
                    nom = nom + "> " + element + "\n";
                });
                nom = nom.trim();
                io.to(socketClient.id).emit('user', `\n${nom}`);
                nom = "";
                break;

            case '/msg':

                break;
            default:
                if (last[last.length - 1] == socketClient.username) {
                    socketClient.broadcast.emit("msg", `${msg}`);
                    last.push(socketClient.username);
                } else {
                    socketClient.broadcast.emit("msg", `\n${socketClient.username}:\n${msg}`)
                    last.push(socketClient.username);
                }
                break;
        }


    })

    // console.log(`${socketClient.username} has arrived !`);
});
server.listen(3000, () => console.log("waiting for users ..."));






    // // server side code
// io.sockets.on('connection', function(socket) {
//     socket.on('create', function(room) {
//       socket.join(room);
//     });
//   });