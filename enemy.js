const activeEnemies = [];
const enemySize = 80; 

function getRandomPosition(min, max, offset) {
    return Math.random() * (max - min - offset - 64) + min + 32;
}

function spawnDeathSlime() {
    // Cria o elemento de imagem de forma padrão para o HTML
    const img = document.createElement('img');
    img.src = 'enemys/DeathSlime.gif';
    img.style.position = 'absolute';
    img.style.width = `${enemySize}px`;  
    img.style.height = `${enemySize}px`; 
    img.style.pointerEvents = 'none';    
    img.style.zIndex = '10'; // Força o GIF a ficar na frente do Canvas

    const posX = getRandomPosition(gameArea.x, gameArea.x + gameArea.size, enemySize);
    const posY = getRandomPosition(gameArea.y, gameArea.y + gameArea.size, enemySize);

    img.style.left = `${posX}px`;
    img.style.top = `${posY}px`;

    // Adiciona o GIF dentro do nosso novo container
    document.getElementById('game-container').appendChild(img);

    activeEnemies.push({
        element: img,
        name: 'DeathSlime',
        hp: 15,
        x: posX,
        y: posY
    });
}

function initEnemies() {
    for (let i = 0; i < 3; i++) {
        spawnDeathSlime();
    }
}