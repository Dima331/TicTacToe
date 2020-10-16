const express = require('express');
const mysql = require("mysql2");
const app = express();
const room = require('./routes/rooms.routes');
const tags = require('./routes/tags.routes');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const path = require('path');
// app.use(express.json());
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));
app.use(bodyParser.json({ 'type': 'application/json' }));
app.use(bodyParser.urlencoded({ 'extended': true }));
app.use('/api/rooms', room);
app.use('/api/tags', tags);
const PORT = process.env.PORT || 3000;

let rooms = new Map;


io.on('connection', (socket) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>connected')
  socket.on('ROOM:JOIN', (roomId) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(
        roomId,
        new Map([['users', new Map()],]),
      );
    }

    if (rooms.get(roomId).get('users').size === 2) {
      socket.emit('ROOM:DISSCONECT', true);
    } else {
      if (rooms.get(roomId).get('users').size === 0) {
        rooms.get(roomId).get('users').set(socket.id, 'X');
        socket.emit('ROOM:SET_SIDE', 'X');
      } else if (rooms.get(roomId).get('users').size === 1) {
        const users = [...rooms.get(roomId).get('users')];
        if (users[0][1] == 'O') {          socket.emit('ROOM:SET_SIDE', 'X');
        } else {
          rooms.get(roomId).get('users').set(socket.id, 'O');
          socket.emit('ROOM:SET_SIDE', 'O');
        }
      }
    }
  })
  socket.on('ROOM:CHANGE_STEP_X', (roomId) => {
    socket.join(roomId);
    socket.emit('ROOM:CORRECT_STATE_X', true);
    socket.broadcast.emit('ROOM:CORRECT_STATE_X', false);
  })

  socket.on('ROOM:ADD', ({ roomId, board, xIsNext, side }) => {
    socket.join(roomId);
    const roomFindQuery = "UPDATE tictac SET steps=? WHERE room=?";
    db.query(roomFindQuery,
      [board.toString(), roomId], async (err, data) => {
      })
    socket.emit('ROOM:STATE', false);
    socket.broadcast.emit('ROOM:STATE', true);
    xIsNext = !xIsNext
    socket.to(roomId).broadcast.emit('ROOM:SET_STEP', { board, xIsNext });
  })
  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        socket.to(roomId).emit('ROOM:SET_USERS', users);
      }
    });
  });

});

app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

//const PORT = process.env.PORT || 5000;

// app.use(bodyParser.json({ 'type': 'application/json' }));
// app.use(bodyParser.urlencoded({ 'extended': true }));
// const PORT = config.get('port') || 5000;
// const rooms = require('./routes/rooms.routes');
// app.use('/api/rooms', rooms);



const db = mysql.createPool({
  connectionLimit : 30,
  host: "eu-cdbr-west-03.cleardb.net",
  user: "b7d5fcc0dab453",
  database: "heroku_834f816ce945ec4",
  password: "fc773d3c"
});

global.db = db;

server.listen(process.env.PORT || 3000);