const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const port = process.env.PORT || 4300;

const server = require('http').createServer(app);
const io = require('socket.io')(server, { origins: '*:*'});

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

io.on('connection', (socket) =>{
  console.log('a user is connected', socket.id)

  // socket.on('dataa', (word) => {
  //   console.log('received data: ', word)
  // })
  // socket.on('disconnect', () => {
  //   console.log('user disconnected')
  // })

  let peerSocketList = [];
  Object.keys(io.sockets.connected).forEach((peerKey) => {
    if (socket.id !== peerKey) {
      peerSocketList.push(io.sockets.connected[peerKey])
    }
  })

  peerSocketList.forEach((peerSocket) => {
    peerSocket.emit('peer', {
      peerId: socket.id,
      initiator: true
    })
    socket.emit('peer', {
      peerId: peerSocket.id,
      initiator: false
    })
  })

  socket.on('signal', (data) => {
    let socket2 = io.sockets.connected[data.peerId];
    if (!socket2) { return; }

    socket2.emit('signal', {
      signal: data.signal,
      peerId: socket.id
    });
  });

})



app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
