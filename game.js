// --- SISTEMA DE MÚSICA DE FUNDO ---
const bgMusic = new Audio('music.mp3');
bgMusic.loop = true;        // Faz a música tocar infinitamente
bgMusic.volume = 0.5;       // Define o volume em 50%

// Tenta iniciar a música assim que o jogador interagir com a tela (exigência dos navegadores)
window.addEventListener('pointerdown', () => {
    // Se a música já estiver tocando, não faz nada, senão inicia
    if (bgMusic.paused) {
        bgMusic.play().catch(err => console.log("Aguardando interação para tocar música:", err));
    }
}, { once: true }); // O 'once: true' garante que esse evento só rode no primeiríssimo toque
// ----------------------------------

// ... restante do seu código do game.js atual (gameLoop, window.onload, etc.) ...
// Carrega a textura do repositório (Essa linha faltou no topo antes)
const stoneTile = new Image();
stoneTile.src = 'stonetile.png'; 

// Função que desenha o cenário
function render() {
    // Limpa a tela com fundo preto
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const tileSize = 32; // Tamanho de cada tile da borda

    // Desenha as bordas horizontais
    for (let i = 0; i < gameArea.size; i += tileSize) {
        ctx.drawImage(stoneTile, gameArea.x + i, gameArea.y, tileSize, tileSize);
        ctx.drawImage(stoneTile, gameArea.x + i, gameArea.y + gameArea.size - tileSize, tileSize, tileSize);
    }

    // Desenha as bordas verticais
    for (let i = 0; i < gameArea.size; i += tileSize) {
        ctx.drawImage(stoneTile, gameArea.x, gameArea.y + i, tileSize, tileSize);
        ctx.drawImage(stoneTile, gameArea.x + gameArea.size - tileSize, gameArea.y + i, tileSize, tileSize);
    }
}

// Força o jogo a inicializar assim que a janela do navegador carregar completamente
function gameLoop() {
    render();          // Desenha o fundo e bordas
    updateEffects();   // Move as partículas
    drawEffects();     // Desenha as partículas no canvas
    
    requestAnimationFrame(gameLoop);
}

window.onload = () => {
    initEnemies();
    createWeaponHUD();
    initInput();
    gameLoop(); // Substitui o render() isolado pelo loop contínuo
};