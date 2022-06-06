const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canHeight = 600;
const canWidth = 800;
canvas.height = canHeight;
canvas.width = canWidth;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

var KeyboardHelper = { left: 37, up: 38, right: 39, down: 40, fire: 17 };

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// Variables for player start position
let x = canvas.width / 2; // Center of canvas
let y = canvas.height / 2; // Center of canvas

let playerMoveSpeed = 1;
let laserLength = 10;

let length = 20;
let asteroidLength = 20;
let asteroidCount = 20;

let laserSpeed = 5;
let laserX = x;
let laserY = y;

let asteroidSpeed = .25;
let asteroidY = 0;

console.log(x, y, "Triangle: x - Position: " + x + ", y - Position: " + y);

function keyDownHandler(event) {
    if (event.keyCode == KeyboardHelper.right) {
        rightPressed = true;
    }
    else if (event.keyCode == KeyboardHelper.left) {
        leftPressed = true;
    }
    if (event.keyCode == KeyboardHelper.down) {
        downPressed = true;
    }
    else if (event.keyCode == KeyboardHelper.up) {
        upPressed = true;
    }
    if (event.keyCode == KeyboardHelper.fire) {
        firePressed = true;
    }
}

function keyUpHandler(event) {
    if (event.keyCode == KeyboardHelper.right) {
        rightPressed = false;
    }
    else if (event.keyCode == KeyboardHelper.left) {
        leftPressed = false;
    }
    if (event.keyCode == KeyboardHelper.down) {
        downPressed = false;
    }
    else if (event.keyCode == KeyboardHelper.up) {
        upPressed = false;
    }
}

function triangle(length, x, y) {

    let pointA = [x, y + length];
    let pointB = [x + length * 2, y + length];
    let pointC = [x + length, y - length];

    ctx.beginPath();
    ctx.moveTo(pointA[0], pointA[1]);
    ctx.lineTo(pointB[0], pointB[1]);
    ctx.lineTo(pointC[0], pointC[1]);
    ctx.lineTo(pointA[0], pointB[1]); // Back to pointA to close the shape
    ctx.strokeStyle = 'gray';
    ctx.stroke();
}

function laser(length, x, y, status) {
    let pointA = [x, y];
    let pointB = [x, y + length];
    if (status != 0) {
        ctx.beginPath();
        ctx.moveTo(pointA[0], pointA[1]);
        ctx.lineTo(pointB[0], pointB[1]);
        ctx.strokeStyle = "#999999";
        ctx.stroke();
    }
}

function shootLaser() {
    // 'Ctrl' used for "fire"

    if (firePressed) {
        laserY -= laserSpeed;
        laser(laserLength, laserX + length, laserY - length, 1);

        if (laserY < 0) {
            firePressed = false;
        }
    }
    if (!firePressed) {
        laserY = y;
        laserX = x;
    }
}

function movePlayer() {
    if (rightPressed) {
        x += playerMoveSpeed;
        if (x > canWidth - length * 2) {
            x = canWidth - length * 2;
        }
    }
    else if (leftPressed) {
        x -= playerMoveSpeed;
        if (x < 0 || x > canvas.width) {
            x = 0;
        }
    }
    else if (downPressed) {
        y += playerMoveSpeed;
        if (y > canHeight - length) {
            y = canHeight - length;
        }
    }
    else if (upPressed) {
        y -= playerMoveSpeed;
        if (y < 0 + length) {
            y = 0 + length;
        }
    }
}

function asteroid(length, asteroidX, asteroidY) {
    let x = asteroidX;
    let y = asteroidY;

    let pointA = [x, y];
    let pointB = [x, y + length];
    let pointC = [x - length, y + length];
    let pointD = [x - length * 2, y];
    let pointE = [x - length, y - length * 2];
    let pointF = [x + length / 2, y - length * 2];
    let pointG = [x + length * 2, y - length];

    ctx.beginPath();
    ctx.moveTo(pointA[0], pointA[1]);
    ctx.lineTo(pointB[0], pointB[1]);
    ctx.lineTo(pointC[0], pointC[1]);
    ctx.lineTo(pointD[0], pointD[1]);
    ctx.lineTo(pointE[0], pointE[1]);
    ctx.lineTo(pointF[0], pointF[1]);
    ctx.lineTo(pointG[0], pointG[1]);
    ctx.lineTo(pointA[0], pointA[1]); // Back to pointA to close the shape

    ctx.strokeStyle = 'gray';

    ctx.stroke();

    asteroidY = y;
    return asteroidY;
}

function getRandomInt(min, max) {
    let ranNum = Math.random(min, max);
    if (ranNum > .25) {
        ranNum *= 1000;
    }
    return ranNum;
}

function createAsteroids() {
    for (let i = 0; i < asteroidCount; i++) {
        asteroid(asteroidLength, randNumArr[i], randNumArr[i * 2 + 2] += asteroidSpeed)
        if (asteroidY > canHeight)
            asteroid(asteroidLength, randNumArr[i], 0);
    }
}

var randNumArr = [];
for (let i = 0; i < asteroidCount; i++) {
    randNumArr[i] = getRandomInt(canWidth, canHeight);
}

function draw() {
    if (canvas.getContext) {
        ctx.clearRect(0, 0, canvas.height, canvas.width);

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        createAsteroids();

        triangle(length, x, y);
        shootLaser();
        movePlayer();
    }
}

setInterval(draw);
clearInterval(1000 / 30);

// NOTE: Need to add rotation when pressing right or left and up moves the ship forward. Scoring system.  Need collision detection.

// Player laser fires more than once, when the laser exits the top of the screen, they can fire again, need to add a timer system, currently it is set to the tip of the triangle as a spawn point.