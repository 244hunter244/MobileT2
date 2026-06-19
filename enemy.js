const activeEnemies = [];
const enemySize = 80; 
let initialSlimesKilled = 0; // Rastreia se os 3 primeiros slimes já morreram

const enemyDatabase = {
    'DeathSlime': 15,
    'BlindedGrimlock': 25,
    'BloodshotEye': 20,
    'BrawnyOgre': 45,
    'CrimsonSlaad': 35,
    'CrushingCyclops': 50,
    'FungalMyconid': 20,
    'HumongousEttin': 60,
    'MurkySlaad': 30,
    'OchreJelly': 25,
    'OcularWatcher': 40,
    'RedCap': 15,
    'ShriekerMushroom': 10,
    'StoneTroll': 55,
    'SwampTroll': 45
};

function getRandomPosition(min, max, offset) {
    return Math.random() * (max - min - offset - 64) + min + 32;
}

function isOverlapping(x, y) {
    for (let enemy of activeEnemies) {
        const distX = x - enemy.x;
        const distY = y - enemy.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        if (distance < enemySize) return true;
    }
    return false;
}

function spawnEnemy(forcedName = null) {
    const enemyNames = Object.keys(enemyDatabase);
    const chosenName = forcedName || enemyNames[Math.floor(Math.random() * enemyNames.length)];
    
    // A cada 20 pontos adiciona +15 de vida base a todos os inimigos que nascerem
    const hpAumento = Math.floor(playerPoints / 20) * 15;
    const maxHp = enemyDatabase[chosenName] + hpAumento;

    const img = document.createElement('img');
    img.src = 'enemys/' + chosenName + '.gif';
    img.style.position = 'absolute';
    img.style.width = enemySize + 'px';  
    img.style.height = enemySize + 'px'; 
    img.style.pointerEvents = 'none';    
    img.style.zIndex = '10'; 

    let posX, posY;
    let attempts = 0;

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
        name: chosenName,
        hp: maxHp,
        x: posX,
        y: posY
    });
}

function initEnemies() {
    initialSlimesKilled = 0;
    for (let i = 0; i < 3; i++) {
        spawnEnemy('DeathSlime');
    }
}

function checkNextWave(lastX, lastY) {
    // Se ainda está na primeira horda, conta a baixa
    if (initialSlimesKilled < 3) {
        initialSlimesKilled++;
        // Quando o terceiro slime inicial morre, dropa obrigatoriamente uma espada no local da morte
        if (initialSlimesKilled === 3) {
            if (typeof forceInitialDrop === 'function') {
                forceInitialDrop(lastX, lastY);
            }
        }
    }

    if (activeEnemies.length === 0) {
        const waveSize = Math.floor(Math.random() * (13 - 5 + 1)) + 5;
        for (let i = 0; i < waveSize; i++) {
            spawnEnemy(); 
        }
    }
}