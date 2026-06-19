// Variável global que guarda a arma atual. Pode ser alterada a qualquer momento!
let equippedWeapon = {
    id: '03',
    src: 'swords/03.png'
};

// Guarda a referência do elemento HTML da imagem para podermos mudar depois
let hudWeaponImageElement = null;

function createWeaponHUD() {
    const container = document.getElementById('game-container');
    const hudSize = 90; 
    const iconSize = 64; 

    const hudBox = document.createElement('div');
    hudBox.style.position = 'absolute';
    hudBox.style.bottom = '20px';
    hudBox.style.right = '20px';
    hudBox.style.width = hudSize + 'px';
    hudBox.style.height = hudSize + 'px';
    hudBox.style.backgroundImage = "url('stonetile.png')"; 
    hudBox.style.backgroundSize = 'contain';
    hudBox.style.display = 'flex';
    hudBox.style.justifyContent = 'center';
    hudBox.style.alignItems = 'center';
    hudBox.style.zIndex = '20'; 
    hudBox.style.border = '2px solid #555';

    // Cria o elemento da imagem e guarda na nossa variável global
    hudWeaponImageElement = document.createElement('img');
    hudWeaponImageElement.src = equippedWeapon.src;
    hudWeaponImageElement.style.width = iconSize + 'px';
    hudWeaponImageElement.style.height = iconSize + 'px';
    hudWeaponImageElement.style.imageRendering = 'pixelated'; 

    hudBox.appendChild(hudWeaponImageElement);
    container.appendChild(hudBox);
}

// Função curta para você chamar quando o jogador ganhar ou comprar uma nova espada
function changeEquippedWeapon(newId) {
    equippedWeapon.id = newId;
    equippedWeapon.src = 'swords/' + newId + '.png';
    
    // Se o HUD já existir na tela, atualiza a imagem na hora
    if (hudWeaponImageElement) {
        hudWeaponImageElement.src = equippedWeapon.src;
    }
}