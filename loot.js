let droppedSwords = [];
let killsUntilNextDrop = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
let currentKillCount = 0;

// Registra a morte de um inimigo e verifica se deve dropar uma espada
function registerKillForLoot(x, y) {
    currentKillCount++;
    if (currentKillCount >= killsUntilNextDrop) {
        currentKillCount = 0;
        killsUntilNextDrop = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
        spawnSwordDrop(x, y);
    }
}

// Força o drop obrigatório (chamado quando os 3 slimes iniciais morrem)
function forceInitialDrop(x, y) {
    spawnSwordDrop(x, y);
}

// Cria la espada física no chão do jogo com dano escalonável
function spawnSwordDrop(x, y) {
    const container = document.getElementById('game-container');
    
    // Define o ID da imagem de 01 a 40
    const randomNum = Math.floor(Math.random() * 40) + 1;
    const swordId = randomNum < 10 ? '0' + randomNum : '' + randomNum;
    
    // A cada 30 pontos, o mínimo (10) e o máximo (50) aumentam em +10, por exemplo
    // playerPoints vem do arquivo hud.js
    const dutoDeAumento = Math.floor(playerPoints / 30) * 10; 
    const minDamage = 10 + dutoDeAumento;
    const maxDamage = 50 + dutoDeAumento;

    const swordDamage = Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
    const isLegendary = swordDamage > 30; // Mantém a regra: maior que 30 brilha em dourado

    const img = document.createElement('img');
    img.src = 'swords/' + swordId + '.png';
    img.style.position = 'absolute';
    img.style.width = '64px';
    img.style.height = '64px';
    img.style.left = (x - 32) + 'px';
    img.style.top = (y - 32) + 'px';
    img.style.zIndex = '15';
    img.style.imageRendering = 'pixelated';
    img.style.cursor = 'pointer';

    if (isLegendary) {
        img.style.filter = 'drop-shadow(0px 0px 8px #ffff00) drop-shadow(0px 0px 2px #ffaa00)';
    } else {
        img.style.filter = 'drop-shadow(0px 0px 6px #ffffff)';
    }

    container.appendChild(img);

    droppedSwords.push({
        element: img,
        id: swordId,
        damage: swordDamage,
        isLegendary: isLegendary,
        x: x - 32,
        y: y - 32,
        size: 64
    });
}

function checkSwordPickup(hx, hy) {
    for (let i = droppedSwords.length - 1; i >= 0; i--) {
        const item = droppedSwords[i];

        if (hx >= item.x && hx <= item.x + item.size &&
            hy >= item.y && hy <= item.y + item.size) {
            
            equippedWeapon.id = item.id;
            equippedWeapon.src = 'swords/' + item.id + '.png';
            equippedWeapon.damage = item.damage;
            equippedWeapon.isLegendary = item.isLegendary;

            if (hudWeaponImageElement) {
                hudWeaponImageElement.src = equippedWeapon.src;
                hudWeaponImageElement.style.transform = 'rotate(-20deg)'; 
                
                if (item.isLegendary) {
                    hudWeaponImageElement.style.filter = 'drop-shadow(0px 0px 6px #ffff00)';
                } else {
                    hudWeaponImageElement.style.filter = 'none';
                }
            }

            item.element.remove();
            droppedSwords.splice(i, 1);
            return true; 
        }
    }
    return false;
}