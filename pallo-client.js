window.onload = function() {
    var header = document.getElementById("header");
    var allUsers = document.getElementById("users");
    var gameWindow = document.getElementById("game-board");
    var lastWinner = document.getElementById("last-winner");
    var circle0 = document.getElementById("circle0");
    var circle1 = document.getElementById("circle1");
    var circle2 = document.getElementById("circle2");
    var circle3 = document.getElementById("circle3");
    var circle4 = document.getElementById("circle4");
    var user_id;
    var userName;

    var socket = io.connect('http://pallo.herokuapp.com', { 
        'sync disconnect on unload': true });
    socket.on('print user names', function (users) {
        allUsers.innerHTML = "<strong>Users:</strong><br>";
        for (i = 0; i < users.length; i++){
            if (users[i].taken) {
                allUsers.innerHTML += users[i].name + "<br>";
            }
        }
    });
    socket.on('set user', function (data) {
        user_id = data;
        userName = prompt("Please enter Your Name");
        socket.emit ('set user name', user_id, userName);
    });
    socket.on('update', function (data) {
        switch (data.circle) {
            case 'circle0':
                circle0.style.backgroundColor = data.color
                break;
            case 'circle1':
                circle1.style.backgroundColor = data.color
                break;
            case 'circle2':
                circle2.style.backgroundColor = data.color
                break;
            case 'circle3':
                circle3.style.backgroundColor = data.color
                break;
            case 'circle4':
                circle4.style.backgroundColor = data.color
                break;
        };
    });
    socket.on('win', function (data) {
        lastWinner.innerHTML = data.user + " user wins!";
    });

    circle0.onclick = function() {
        circle = 0;
        socket.emit('circle click', user_id, circle);
    };
    circle1.onclick = function() {
        circle = 1;
        socket.emit('circle click', user_id, circle);
    };
    circle2.onclick = function() {
        circle = 2;
        socket.emit('circle click', user_id, circle);
    };
    circle3.onclick = function() {
        circle = 3;
        socket.emit('circle click', user_id, circle);
    };
    circle4.onclick = function() {
        circle = 4;
        socket.emit('circle click', user_id, circle);
    };
};
