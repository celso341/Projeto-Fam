var app = require('express')();
var http = require('https').Server(app);
var io = require('socket.io')(http);

var clients = {}; 

app.get('/', function(req, res){
  res.send('server is running');
});

io.on("connection", function (client) {  
    client.on("join", function(name){
    	console.log("En: " + name);
        clients[client.id] = name;
        client.emit("update", "Voce esta conectado.");
        client.broadcast.emit("update", name + " Entrou na sala.")
    });

    client.on("send", function(msg){
    	console.log("Message: " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("disconnect", function(){
    	console.log("Disconnect");
        io.emit("update", clients[client.id] + " deixou o servidor.");
        delete clients[client.id];
    });
});


http.listen(3000, function(){
  console.log('listening on port 3000');  //listening on port 3000 conexão Padrão "do site e 21"
});
