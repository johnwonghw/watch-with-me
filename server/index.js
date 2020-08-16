const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const port = process.env.PORT || 4300;

const server = require('http').createServer(app);
const io = require('socket.io')(server, { origins: '*:*' });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cors issue fix
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});
app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

io.on('connection', (socket) => {
  console.log('a user is connected', socket.id)
  socket.on('join-room', (data) => {
    let roomId = data.roomId
    if (roomId) {
      socket.join(roomId);

      io.to(roomId).emit('update-room-data', {
        roomClientCount: Object.keys(io.sockets.adapter.rooms[roomId].sockets).length
      });

      let peerSocketList = [];
      let roomClientsId = Object.keys(io.sockets.adapter.rooms[roomId].sockets)
      console.log({ roomClientsId })
      roomClientsId.forEach((peerKey) => {
        if (socket.id !== peerKey) {
          peerSocketList.push(io.sockets.connected[peerKey])
        }
      })

      socket.on('pend-video', (data) => {
        let { videoSrc } = data;

        io.to(roomId).emit('update-video', {
          videoSrc
        });
      })

      socket.on('room-message', (data) => {
        socket.broadcast.to(roomId).emit('message', {
          username: data.username,
          text: data.text
        })
      })

      socket.on('play-video', (data) => {
        io.to(roomId).emit('play-video');
      })
      socket.on('pause-video', (data) => {
        io.to(roomId).emit('pause-video');
      })
      socket.on('seek-video', (data) => {
        io.to(roomId).emit('seek-video', {
          played: data.played
        });
      })

      socket.on('disconnect', () => {
        if (io.sockets.adapter.rooms && io.sockets.adapter.rooms[roomId]) {
          io.to(roomId).emit('update-room-data', {
            roomClientCount: Object.keys(io.sockets.adapter.rooms[roomId].sockets).length
          });
        }
      })
    }
  })
})



app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
