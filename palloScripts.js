window.onload = function() {
  var header = document.getElementById("header");
  var allUsers = document.getElementById("users");
  var gameWindow = document.getElementById("game-board");
  var lastWinner = document.getElementById("last-winner");
  var circle1 = document.getElementById("circle1")
  var circle2 = document.getElementById("circle2")
  var circle3 = document.getElementById("circle3")
  var circle4 = document.getElementById("circle4")
  var circle5 = document.getElementById("circle5")
  //var params[2];

  var socket = io.connect('http://localhost');
  socket.on('users', function (data) {
    allUsers.innerHTML = "<strong>Users:</strong>" + data.users;
  });
  socket.on('update', function (data) {
    circle1.style.backgroundColor = "red";
  });
  socket.on('win', function (data) {
  });

  circle1.onclick = function(data) {
    //params[0] = user_id;
    //params[1] = circle1;
    socket.emit('circleclick');
  }
/*           circle2.onClick = function() {
    data[0] = user_id;
    data[1] = circle2;
    socket.emit(data);
  };
  circle3.onClick = function() {
    data[0] = user_id;
    data[1] = circle3;
    socket.emit("clickdata");
  };
  circle4.onClick = function() {
    data[0] = user_id;
    data[1] = circle4;
    socket.emit(data);
  };
  circle5.onClick = function() {
    data[0] = user_id;
    data[1] = circle5;
    socket.emit(data);
  };
*/
};
