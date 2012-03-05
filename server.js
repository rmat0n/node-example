var app = require('express').createServer(),
    io = require('socket.io').listen(app); 

app.listen(process.env.C9_PORT || 8333); 

app.get('/', function (req, res) { 
    res.sendfile(__dirname + '/public/index.html'); 
}); 

var allClients = 0; 
var clientId = 1; 

io.sockets.on('connection', function (client) { 
    var my_timer; 
    var my_client = { 
        "id": clientId, 
        "obj": client 
    }; 
    
    clientId += 1; 
    allClients += 1; 
    
    my_timer = setInterval(function () { 
        my_client.obj.send(JSON.stringify({ 
            "timestamp": (new Date()).getTime(), 
            "clients": allClients 
        })); 
    }, 1000); 
    
    client.on('message', function(data) { 
        my_client.obj.broadcast.send(JSON.stringify({ 
            message: "poke send by client " + my_client.id 
        })); 
        console.log(data); 
    });
    
    client.on('disconnect', function() { 
        clearTimeout(my_timer); 
        allClients -= 1; 
        console.log('disconnect'); 
    }); 
});
