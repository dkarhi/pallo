var handler = function(req, res) {
  fs.readFile('./pallo.html', function (err, data) {
    if(err) throw err;
    res.writeHead(200);
    res.end(data);
  });

};

gameBoard = [ 0, 0, 0, 0, 0 ];

users = [
  {color: "white", count: 0, taken: 1, name: ""},
  {color: "red", count: 0, taken: 0, name: ""},
  {color: "blue", count: 0, taken: 0, name: ""},
  {color: "yellow", count: 0, taken: 0, name: ""},
  {color: "green", count: 0, taken: 0, name: ""}
];


var server = require('http').createServer(handler);
var io = require('socket.io').listen(server);
var fs = require('fs');
var port = process.env.PORT || 80;

server.listen(port);

io.sockets.on('connection', function (socket) {
  // Find the first available color
  var user_id;
  for (i = 1; i < users.length; i++) {
    if (users[i].taken === 0) {
      users[i].taken = 1;
      user_id = i;
      break;
    }
  }

  socket.emit("setUser", user_id);
  socket.emit("update", { circle: 'circle0', color: users[gameBoard[0]].color });
  socket.emit("update", { circle: 'circle1', color: users[gameBoard[1]].color });
  socket.emit("update", { circle: 'circle2', color: users[gameBoard[2]].color });
  socket.emit("update", { circle: 'circle3', color: users[gameBoard[3]].color });
  socket.emit("update", { circle: 'circle4', color: users[gameBoard[4]].color });
  
  socket.on("circleclick", function(user_id, circle) {
    updateColor(circle, user_id);
  });
  socket.on("disconnect", function() {
    removeUser(user_id);
  });
    socket.on("getUsers", function() {
    socket.emit("updateUsers", [ users: users ]);
  });
    socket.on("setUserName", function(user_id, userName) {
    users[user_id].name = userName;
  });
});

var updateColor = function(circle, user_id) {
  circleID = "circle" + circle;
  var newColor = user_id;

  if (gameBoard[circle] == 0) {
    users[user_id].count++
  }
  else if ( gameBoard[circle] != user_id) {
    newColor = 0;
    users[gameBoard[circle]].count--
  }

  io.sockets.emit("update", { circle: circleID, color: users[newColor].color });
  gameBoard[circle] = newColor;
  if (users[user_id].count === 3) {
    io.sockets.emit("win", { user: users[user_id].color });
    clearBoard();
  }
}

var clearBoard = function() {
  for (i = 0; i < gameBoard.length; i++) {
    gameBoard[i] = 0;
  }
  for (i = 0; i < users.length; i++) {
    users[i].count = 0;
  }
  io.sockets.emit("update", { circle: 'circle0', color: users[gameBoard[0]].color });
  io.sockets.emit("update", { circle: 'circle1', color: users[gameBoard[1]].color });
  io.sockets.emit("update", { circle: 'circle2', color: users[gameBoard[2]].color });
  io.sockets.emit("update", { circle: 'circle3', color: users[gameBoard[3]].color });
  io.sockets.emit("update", { circle: 'circle4', color: users[gameBoard[4]].color });
}

var removeUser = function (user_id) {
  users[user_id].taken = 0;
}
