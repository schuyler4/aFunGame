const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const uuid = require('uuid');

app.use(express.static('public'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

let sockets = [];
io.sockets.on('connection', function(socket) {
  let randomX = Math.floor(Math.random() * (580 -  0 + 1)) + 0;
  let randomY = Math.floor(Math.random() * (380 -  0 + 1)) + 0;
  let movementSpeed = 20;

  socket.id = Math.random()
  socket.x = randomX;
  socket.y = randomY;
  socket.size = 20;
  socket.bullets = [];
  sockets[socket.id] = socket;

  socket.on('move', function(direction) {
    if(direction == "right") {
      socket.x += movementSpeed;
    }
    if(direction == "left") {
      socket.x -= movementSpeed;
    }

    if(direction == "up") {
      socket.y -= movementSpeed;
    }
    if (direction == "down") {
      socket.y += movementSpeed;
    }
  });

  socket.on('shoot', function(direction) {
    socket.bullets.push({
      x: socket.x,
      y: socket.y,
      direction: direction
    });
  });

  socket.on('disconnect', function() {
    delete sockets[socket.id];
  });

});

let update = function() {
  let players = [];

  for(let i in sockets) {
    for(let j in sockets[i].bullets) {
      if(sockets[i].bullets[j].direction == "up")
        sockets[i].bullets[j].y -= 15;
      if(sockets[i].bullets[j].direction == "down")
        sockets[i].bullets[j].y += 15;
      if(sockets[i].bullets[j].direction == "left")
        sockets[i].bullets[j].x -= 15;
      if(sockets[i].bullets[j].direction == "right")
        sockets[i].bullets[j].x += 15;

      let playerX = sockets[i].x;
      let playerY = sockets[i].y;

      let bulletX = sockets[i].bullets[j].x;
      let bulletY = sockets[i].bullets[j].y;

      let playerSize = sockets[i].size;

      rect_collision = function(x1, y1, size1, x2, y2, size2) {
        var bottom1, bottom2, left1, left2, right1, right2, top1, top2;
        left1 = x1 - size1;
        right1 = x1 + size1;
        top1 = y1 - size1;
        bottom1 = y1 + size1;
        left2 = x2 - size2;
        right2 = x2 + size2;
        top2 = y2 - size2;
        bottom2 = y2 + size2;
        return !(left1 > right2 || left2 > right1 || top1 > bottom2 || top2 > bottom1);
      };

      if(rect_collision(playerX, playerY, playerSize, bulletX, bulletY, 10)) {
        sockets[i].size -= 10;
      }

    }
    players.push({
      x: sockets[i].x - 5,
      y: sockets[i].y - 5,
      size: sockets[i].size,
      bullets: sockets[i].bullets
    });
  }

  for(let i in sockets) {
    io.emit('update', players);
  }
}

setInterval(update, 30);

http.listen(3000, function() {
  console.log("the magic is on port 3000");
});
