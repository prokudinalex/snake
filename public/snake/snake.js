'use strict';

var context;
var canvas;

var gridSize = 20;
var tileCount = 20;
var p = {};
var a = {};
p.x = getRandomCoord();
p.y = getRandomCoord();
p.vx = 0;
p.vy = 0;
var trail = [];
var tail = 0;

window.onload = function() {
    canvas = document.getElementById('gc');
    context = canvas.getContext('2d');
    document.addEventListener('keydown', keyPush);
    setInterval(game, 1000 / 10);
    generateApple();
}

function getRandomCoord() {
    return Math.floor(Math.random() * tileCount);
}

function game() {
    try {
        moveTrail();
        movePlayer();
        checkApple();
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'lime';
        for (var i = 0; i < trail.length; i++) {
            context.fillRect(trail[i].x * gridSize, trail[i].y * gridSize, gridSize - 2, gridSize - 2);
        }
        context.fillRect(p.x * gridSize, p.y * gridSize, gridSize - 2, gridSize - 2);
        context.fillStyle = 'red';
        context.fillRect(a.x * gridSize, a.y * gridSize, gridSize - 2, gridSize - 2);
    } catch (ex) {
        console.error(ex);
    }
}

function generateApple() {
    a.x = getRandomCoord();
    a.y = getRandomCoord();
    if (a.x == p.x && a.y == p.y) {
        generateApple();
    }
}

function checkApple() {
    if (p.x == a.x && p.y == a.y) {
        tail++;
        console.log(tail);
        generateApple();
    }
}

function movePlayer() {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) {
        p.x = tileCount - 1;
    }

    if (p.x > tileCount - 1) {
        p.x = 0;
    }

    if (p.y < 0) {
        p.y = tileCount - 1;
    }

    if (p.y > tileCount - 1) {
        p.y = 0;
    }
}

function moveTrail() {
    trail.push({x: p.x, y: p.y});
    while(trail.length > tail) {
        trail.shift();
    }
}

function keyPush(event) {
    switch(event.keyCode) {
        case 38:
            p.vx = 0;
            p.vy = -1;
            break;
        case 39:
            p.vx = 1;
            p.vy = 0;
            break;
        case 40:
            p.vx = 0;
            p.vy = 1;
            break;
        case 37:
            p.vx = -1;
            p.vy = 0;
            break;
        default:
            // nothing
    }
}
