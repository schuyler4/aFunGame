const socket = io();
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let shootDirection = "up";
document.addEventListener("keydown", function(e) {
  if(e.keyCode == 68) {
    const direction = "right";
    shootDirection = "right";
    socket.emit('move', direction);
  }
  if(e.keyCode == 65) {
    const direction = "left";
    shootDirection = "left";
    socket.emit('move', direction);
  }
  if(e.keyCode == 87) {
    const direction = "up";
    shootDirection = "up";
    socket.emit('move', direction);
  }
  if(e.keyCode == 83) {
    const direction = "down";
    shootDirection = "down";
    socket.emit('move', direction);
  }
  if(e.keyCode == 32) {
    socket.emit('shoot', shootDirection);
  }
}, false);

socket.on('update', function(data) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for(i = 0; i < data.length; i++) {
    ctx.beginPath();
    ctx.rect(data[i].x, data[i].y, data[i].size, data[i].size);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    for (j = 0; j < data[i].bullets.length; j++) {
      ctx.beginPath();
      ctx.rect(data[i].bullets[j].x, data[i].bullets[j].y, 10, 10);
      ctx.fillStyle = "blue";
      ctx.fill();
      ctx.closePath();
    }
  }

  /*for (i = 0; i < data[i].bullets.length; i++) {
    ctx.beginPath();
    ctx.rect(data[i].x, data[i].y, 10, 10);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }*/
  //console.log(data)
});
