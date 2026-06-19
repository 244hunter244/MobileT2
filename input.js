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
function triggerAttackAnimation(x, y) {
    const container = document.getElementById('game-container');
    const attackImg = document.createElement('img');
    
    attackImg.src = equippedWeapon.src;
    attackImg.style.position = 'absolute';
    attackImg.style.width = '80px';
    attackImg.style.height = '80px';
    attackImg.style.left = (x - 40) + 'px';
    attackImg.style.top = (y - 40) + 'px';
    attackImg.style.zIndex = '30';
    attackImg.style.pointerEvents = 'none';
    attackImg.style.imageRendering = 'pixelated';
    attackImg.style.transition = 'transform 0.15s linear';
    attackImg.style.transform = 'rotate(0deg)';

    // Se a arma equipada for lendária, a própria animação de ataque ganha o brilho dourado
    if (equippedWeapon.isLegendary) {
        attackImg.style.filter = 'drop-shadow(0px 0px 6px #ffff00)';
    }

    container.appendChild(attackImg);

    requestAnimationFrame(() => {
        attackImg.style.transform = 'rotate(180deg)';
    });

    setTimeout(() => {
        attackImg.remove();
    }, 150);
}

function checkEnemyHit(hx, hy) {
    // 1º Passo: Checar se o clique foi para coletar uma espada no chão
    if (typeof checkSwordPickup === 'function' && checkSwordPickup(hx, hy)) {
        return; // Interrompe a função para não golpear ao coletar o item
    }

    // Usa dinamicamente o dano da arma atualmente equipada (começa com 8)
    const currentDamage = equippedWeapon.damage;

    for (let i = activeEnemies.length - 1; i >= 0; i--) {
        const enemy = activeEnemies[i];

        if (hx >= enemy.x && hx <= enemy.x + enemySize &&
            hy >= enemy.y && hy <= enemy.y + enemySize) {
            
            enemy.hp -= currentDamage; 

            // Exibe o número de dano atualizado flutuando em branco
            spawnDamageText(hx, hy, currentDamage);

            if (enemy.hp <= 0) {
                if (typeof createDeathEffect === 'function') {
                    createDeathEffect(enemy.x, enemy.y);
                }
                
                if (typeof addPoint === 'function') {
                    addPoint();
                }

                // Notifica o sistema de loot para contabilizar a morte e possivelmente dropar um item
                if (typeof registerKillForLoot === 'function') {
                    registerKillForLoot(enemy.x, enemy.y);
                }

                enemy.element.remove();              
                activeEnemies.splice(i, 1);          

                if (typeof checkNextWave === 'function') {
                    checkNextWave(); 
                }
            }
            break; 
        }
    }
}