const activeEnemies = [];
const enemySize = 60; 

function getRandomPosition(min, max, offset) {
    return Math.random() * (max - min - offset - 64) + min + 32;
}

function spawnDeathSlime() {
    const img = document.createElement('img');
    img.src = 'enemys/DeathSlime.gif';
    img.style.position = 'absolute';
    
    // Mudado para aspas simples e (+) para evitar erros de digitação com a crase
    img.style.width = enemySize + 'px';  
    img.style.height = enemySize + 'px'; 
    img.style.pointerEvents = 'none';    
    img.style.zIndex = '10'; 

    const posX = getRandomPosition(gameArea.x, gameArea.x + gameArea.size, enemySize);
    const posY = getRandomPosition(gameArea.y, gameArea.y + gameArea.size, enemySize);

    // Mudado aqui também para aspas simples e (+)
    img.style.left = posX + 'px';
    img.style.top = posY + 'px';

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