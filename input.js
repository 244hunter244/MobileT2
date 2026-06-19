const activeEnemies = [];
const enemySize = 80; 

// Contador para saber quantas hordas o jogador já derrotou
let waveCount = 0;
let isWeaponDropped = false;

const enemyDatabase = {
    'DeathSlime': 15, 'BlindedGrimlock': 25, 'BloodshotEye': 20, 'BrawnyOgre': 45,
    'CrimsonSlaad': 35, 'CrushingCyclops': 50, 'FungalMyconid': 20, 'HumongousEttin': 60,
    'MurkySlaad': 30, 'OchreJelly': 25, 'OcularWatcher': 40, 'RedCap': 15,
    'ShriekerMushroom': 10, 'StoneTroll': 55, 'SwampTroll': 45
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
    const maxHp = enemyDatabase[chosenName];

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
        element: img, name: chosenName, hp: maxHp, x: posX, y: posY
    });
}

function initEnemies() {
    for (let i = 0; i < 3; i++) {
        spawnEnemy('DeathSlime');
    }
}

// Executa a lógica de criar uma nova horda de monstros normais
function triggerNextMonsterWave() {
    const waveSize = Math.floor(Math.random() * (13 - 5 + 1)) + 5;
    for (let i = 0; i < waveSize; i++) {
        spawnEnemy();
    }
    waveCount++;
}

function checkNextWave() {
    if (activeEnemies.length === 0) {
        // Se for logo após os 3 Slimes iniciais (waveCount === 0) OU a cada 10 ondas completadas
        if (waveCount === 0 || waveCount % 10 === 0) {
            spawnDroppedWeapon();
        } else {
            triggerNextMonsterWave();
        }
    }
}

// Instancia a nova espada no centro geométrico do mapa com efeito de pulso luminoso
function spawnDroppedWeapon() {
    isWeaponDropped = true;
    const container = document.getElementById('game-container');
    
    // Lista de supostos IDs disponíveis na sua pasta de assets (ex: de '01' a '10')
    const weaponIds = ['01', '02', '04', '05', '06', '07', '08', '09', '10'];
    const randomId = weaponIds[Math.floor(Math.random() * weaponIds.length)];
    // Sorteia um dano aleatório entre 10 e 25 para a nova arma
    const randomDamage = Math.floor(Math.random() * (25 - 10 + 1)) + 10;

    const groundWeapon = document.createElement('img');
    groundWeapon.id = 'dropped-weapon-item';
    groundWeapon.src = 'swords/' + randomId + '.png';
    groundWeapon.style.position = 'absolute';
    groundWeapon.style.width = '70px';
    groundWeapon.style.height = '70px';
    
    // Centraliza perfeitamente no meio da gameArea
    const centerX = gameArea.x + (gameArea.size / 2) - 35;
    const centerY = gameArea.y + (gameArea.size / 2) - 35;
    groundWeapon.style.left = centerX + 'px';
    groundWeapon.style.top = centerY + 'px';
    groundWeapon.style.zIndex = '15';
    groundWeapon.style.imageRendering = 'pixelated';
    
    // Filtros CSS para criar o brilho branco intenso pulsante
    groundWeapon.style.filter = 'drop-shadow(0 0 12px rgba(255, 255, 255, 1)) brightness(1.3)';
    groundWeapon.style.transition = 'transform 0.4s ease-in-out';
    
    // Cria animação simples de flutuar/pulsar sem precisar de CSS externo
    let pulseDirection = 1;
    const pulseInterval = setInterval(() => {
        if (!document.getElementById('dropped-weapon-item')) {
            clearInterval(pulseInterval);
            return;
        }
        groundWeapon.style.transform = `scale(${1 + (0.1 * pulseDirection)})`;
        pulseDirection *= -1;
    }, 400);

    // Salva os dados sorteados na própria tag HTML para resgatarmos no clique
    groundWeapon.dataset.weaponId = randomId;
    groundWeapon.dataset.weaponDamage = randomDamage;

    container.appendChild(groundWeapon);
}