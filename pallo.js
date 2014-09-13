var handler = function(req, res) {
  fs.readFile('./pallo.html', function (err, data) {
    if(err) throw err;
    res.writeHead(200);
    res.end(data);
  });

};

users = [
  {color: "white", count: 0},
  {color: "red", count: 0},
  {color: "blue", count: 0},
  {color: "yellow", count: 0},
  {color: "green", count: 0}
];

var server = require('http').createServer(handler);
var io = require('socket.io').listen(server);
var fs = require('fs');
var port = 8080;

server.listen(port);

io.sockets.on('connection', function (socket) {
//  var user = addUser();
//  updateBoard();
//  socket.emit("Welcome", user);
//  socket.on('disconnect', function () {
//    removeUser(user);
//  });
  socket.on("click", function() {
    setGamePiece();
  });
  socket.on("circleclick", function(user_id, circle) {
    updateColor(circle, user_id);

  });
});

var updateColor = function(circle, user_id) {
  io.sockets.emit("update", { circle: circle, color: users[user_id].color });
}
