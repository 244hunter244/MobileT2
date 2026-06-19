// Variável da arma com dano inicial de 8 e sem brilho de início
let equippedWeapon = {
    id: '03',
    src: 'swords/03.png',
    damage: 8,
    isLegendary: false
};

let hudWeaponImageElement = null;
let playerPoints = 0;
let pointsValueElement = null;

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
    hudBox.style.backgroundSize = 'cover'; // Garante que a pedra preencha todo o quadrado
    hudBox.style.display = 'flex';
    hudBox.style.justifyContent = 'center';
    hudBox.style.alignItems = 'center';
    hudBox.style.zIndex = '20'; 
    hudBox.style.border = '2px solid #555';

    hudWeaponImageElement = document.createElement('img');
    hudWeaponImageElement.src = equippedWeapon.src;
    hudWeaponImageElement.style.width = iconSize + 'px';
    hudWeaponImageElement.style.height = iconSize + 'px';
    hudWeaponImageElement.style.imageRendering = 'pixelated'; 
    hudWeaponImageElement.style.transform = 'rotate(-20deg)'; // Mantém o giro de 20 graus para a esquerda

    hudBox.appendChild(hudWeaponImageElement);
    container.appendChild(hudBox);
    
    createPointsHUD();
}

function createPointsHUD() {
    const container = document.getElementById('game-container');

    const scoreContainer = document.createElement('div');
    scoreContainer.style.position = 'absolute';
    scoreContainer.style.top = '20px';
    scoreContainer.style.right = '20px';
    scoreContainer.style.fontFamily = "'Press Start 2P', monospace";
    scoreContainer.style.textAlign = 'right';
    scoreContainer.style.zIndex = '20';

    const pointsLabel = document.createElement('div');
    pointsLabel.innerText = 'PONTOS';
    pointsLabel.style.color = '#ffffff';
    pointsLabel.style.fontSize = '12px';
    pointsLabel.style.marginBottom = '8px';

    pointsValueElement = document.createElement('div');
    pointsValueElement.innerText = playerPoints;
    pointsValueElement.style.color = '#ffff00';
    pointsValueElement.style.fontSize = '28px';

    scoreContainer.appendChild(pointsLabel);
    scoreContainer.appendChild(pointsValueElement);
    container.appendChild(scoreContainer);
}

function addPoint() {
    playerPoints += 1;
    if (pointsValueElement) {
        pointsValueElement.innerText = playerPoints;
    }
}