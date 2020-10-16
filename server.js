const express = require('express');
const mysql = require("mysql2");
const app = express();

// const server = app.listen(5000)
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(express.json());

// app.use(bodyParser.json({ 'type': 'application/json' }));
// app.use(bodyParser.urlencoded({ 'extended': true }));
// const PORT = config.get('port') || 5000;
// const rooms = require('./routes/rooms.routes');
// app.use('/api/rooms', rooms);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "manager",
  password: "root"
});

db.connect((err) => {
  if (err) { throw err; }
  console.log('Connected to database');
});

global.db = db;
let rooms = new Map;

const room = require('./routes/rooms.routes');
const tags = require('./routes/tags.routes');

app.use('/api/rooms', room);
app.use('/api/tags', tags);

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
        if (users[0][1] == 'O') {
          rooms.get(roomId).get('users').set(socket.id, 'X');
          socket.emit('ROOM:SET_SIDE', 'X');
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

// app.listen(PORT, () => console.log(`here port ${PORT}`));
server.listen(9090, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log('Сервер запущен!');
});
