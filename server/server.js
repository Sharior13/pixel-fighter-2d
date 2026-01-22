const express = require('express');
const { createServer} = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const port = 2000;
const app = express();
const server = createServer(app);
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000, autoConnect: false});

app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.sendFile(join(__dirname, 'index.html'));
});


//middleware
//redirect all routes to '/'
app.use((req, res)=>{
    res.redirect('/');
});


//handle socket events
const { socketHandler } = require('./networking/socketHandler.js');
socketHandler(io);

//handle server side gameloop(players, movements, bullets)
// const serverGameLoop = require('./gameLoop.js');
// serverGameLoop(io);


server.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});