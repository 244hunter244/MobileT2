const activeEnemies = [];
const enemySize = 80; 

function getRandomPosition(min, max, offset) {
    return Math.random() * (max - min - offset - 64) + min + 32;
}

// Função curta que calcula a distância entre dois pontos e checa se há colisão
function isOverlapping(x, y) {
    for (let enemy of activeEnemies) {
        const distX = x - enemy.x;
        const distY = y - enemy.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        // Se a distância for menor que o tamanho do inimigo, eles estão sobrepostos
        if (distance < enemySize) {
            return true;
        }
    }
    return false;
}

function spawnDeathSlime() {
    const img = document.createElement('img');
    img.src = 'enemys/DeathSlime.gif';
    img.style.position = 'absolute';
    img.style.width = enemySize + 'px';  
    img.style.height = enemySize + 'px'; 
    img.style.pointerEvents = 'none';    
    img.style.zIndex = '10'; 

    let posX, posY;
    let attempts = 0;

    // Tenta sortear uma posição livre até 50 vezes para evitar travamento
    do {
        posX = getRandomPosition(gameArea.x, gameArea.x + gameArea.size, enemySize);
        posY = getRandomPosition(gameArea.y, gameArea.y + gameArea.size, enemySize);
        attempts++;
    } while (isOverlapping(posX, posY) && attempts < 50);

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