const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 16;
const FLOOR_Y = canvas.height - 50;

// Carregamento direto da raiz do repositório
const playerImg = new Image();
playerImg.src = 'player.png'; 

const tileImg = new Image();
tileImg.src = 'tile1.png';

const player = {
    x: 100,
    y: FLOOR_Y - 16,
    width: 16,
    height: 16,
    vx: 0,
    vy: 0,
    acceleration: 0.5,
    friction: 0.85,
    maxSpeed: 4
};

const keys = {
    ArrowLeft: false,
    ArrowRight: false
};

window.addEventListener('keydown', (e) => {
    if (e.key in keys) keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key in keys) keys[e.key] = false;
});

function updatePhysics() {
    if (keys.ArrowLeft) {
        player.vx -= player.acceleration;
    }
    if (keys.ArrowRight) {
        player.vx += player.acceleration;
    }

    player.vx *= player.friction;

    if (player.vx > player.maxSpeed) player.vx = player.maxSpeed;
    if (player.vx < -player.maxSpeed) player.vx = -player.maxSpeed;

    player.x += player.vx;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < canvas.width; x += TILE_SIZE) {
        ctx.drawImage(tileImg, x, FLOOR_Y, TILE_SIZE, TILE_SIZE);
    }

    ctx.drawImage(playerImg, Math.floor(player.x), Math.floor(player.y), player.width, player.height);
}

function gameLoop() {
    updatePhysics();
    draw();
    requestAnimationFrame(gameLoop);
}

Promise.all([
    new Promise(resolve => playerImg.onload = resolve),
    new Promise(resolve => tileImg.onload = resolve)
]).then(() => {
    requestAnimationFrame(gameLoop);
}).catch(err => {
    console.error("Erro ao carregar os sprites:", err);
});
