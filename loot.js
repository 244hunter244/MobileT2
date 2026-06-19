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

// Cria a espada física no chão do jogo
function spawnSwordDrop(x, y) {
    const container = document.getElementById('game-container');
    
    // Define o ID da imagem de 01 a 40 formatando com zero à esquerda se necessário
    const randomNum = Math.floor(Math.random() * 40) + 1;
    const swordId = randomNum < 10 ? '0' + randomNum : '' + randomNum;
    
    // Atributos aleatórios da arma
    const swordDamage = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
    const isLegendary = swordDamage > 30;

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

    // Aplica a animação de brilho (CSS de filtro) baseado na raridade
    if (isLegendary) {
        img.style.filter = 'drop-shadow(0px 0px 8px #ffff00) drop-shadow(0px 0px 2px #ffaa00)';
    } else {
        img.style.filter = 'drop-shadow(0px 0px 6px #ffffff)';
    }

    container.appendChild(img);

    // Registra no array lógico de itens coletáveis
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

// Verifica se o jogador clicou/toucou em alguma espada no chão para equipar
function checkSwordPickup(hx, hy) {
    for (let i = droppedSwords.length - 1; i >= 0; i--) {
        const item = droppedSwords[i];

        // Checa se o clique ocorreu dentro do quadrado da espada dropada
        if (hx >= item.x && hx <= item.x + item.size &&
            hy >= item.y && hy <= item.y + item.size) {
            
            // Substitui os dados da arma equipada globalmente
            equippedWeapon.id = item.id;
            equippedWeapon.src = 'swords/' + item.id + '.png';
            equippedWeapon.damage = item.damage;
            equippedWeapon.isLegendary = item.isLegendary;

            // Atualiza o HUD visual na hora
            if (hudWeaponImageElement) {
                hudWeaponImageElement.src = equippedWeapon.src;
                // Se a nova arma for lendária, faz o ícone do HUD brilhar em dourado permanentemente
                if (item.isLegendary) {
                    hudWeaponImageElement.style.filter = 'drop-shadow(0px 0px 6px #ffff00)';
                } else {
                    hudWeaponImageElement.style.filter = 'none';
                }
            }

            // Remove o item do chão
            item.element.remove();
            droppedSwords.splice(i, 1);
            return true; // Bloqueia o ataque para apenas coletar a espada
        }
    }
    return false;
}