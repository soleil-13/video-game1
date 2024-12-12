const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverText = document.getElementById('gameOver');
const highScoreText = document.getElementById('highScore');

const playerWidth = 30; // Width of the player in "pixels"
const playerHeight = 50; // Height of the player
let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - playerHeight - 10;
let playerSpeed = 5;

let fallingObjects = [];
let objectSpeed = 2;
let score = 0;
let gameOver = false;

// Retrieve the high score from localStorage
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
highScoreText.textContent = `High Score: ${highScore}`;

// Handle keyboard inputs
let leftPressed = false;
let rightPressed = false;

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        leftPressed = true;
    }
    if (e.key === 'ArrowRight') {
        rightPressed = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        leftPressed = false;
    }
    if (e.key === 'ArrowRight') {
        rightPressed = false;
    }
});

// Create a falling object
function createFallingObject() {
    const size = Math.random() * (40 - 20) + 20;
    fallingObjects.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        width: size,
        height: size
    });
}

// Draw the pixelated player (a simple pixel person)
function drawPlayer() {
    // Head (3x3 pixels)
    ctx.fillStyle = 'peachpuff'; // Head color
    ctx.fillRect(playerX + 11, playerY + 5, 8, 8); // Head

    // Body (2x3 pixels)
    ctx.fillStyle = 'blue'; // Body color
    ctx.fillRect(playerX + 10, playerY + 15, 10, 20); // Body

    // Arms (2x3 pixels each)
    ctx.fillStyle = 'green'; // Arm color
    ctx.fillRect(playerX + 3, playerY + 15, 7, 5); // Left arm
    ctx.fillRect(playerX + 20, playerY + 15, 7, 5); // Right arm

    // Legs (2x3 pixels each)
    ctx.fillStyle = 'blue'; // Leg color
    ctx.fillRect(playerX + 10, playerY + 35, 4, 10); // Left leg
    ctx.fillRect(playerX + 16, playerY + 35, 4, 10); // Right leg
}

// Update game state
function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update player position
    if (leftPressed && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (rightPressed && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    }

    // Draw player (as a pixelated person)
    drawPlayer();

    // Update and draw falling objects
    for (let i = fallingObjects.length - 1; i >= 0; i--) {
        const obj = fallingObjects[i];
        obj.y += objectSpeed;
        if (obj.y > canvas.height) {
            fallingObjects.splice(i, 1);
            score++;
        }

        // Check for collision with player
        if (obj.y + obj.height > playerY && obj.x < playerX + playerWidth && obj.x + obj.width > playerX) {
            gameOver = true;
            gameOverText.style.display = 'block';

            // Update high score if necessary
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore); // Save the high score
            }
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }

    // Display score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Display high score
    highScoreText.textContent = `High Score: ${highScore}`;

    // Create new falling object every 1.5 seconds
    if (Math.random() < 0.02) {
        createFallingObject();
    }

    // Repeat the update
    if (!gameOver) {
        requestAnimationFrame(update);
    }
}

// Start the game loop
update();

// Restart the game when pressing 'S' key
window.addEventListener('keydown', (e) => {
    if (e.key === 's' || e.key === 'S') {
        gameOver = false;
        gameOverText.style.display = 'none';
        playerX = canvas.width / 2 - playerWidth / 2;
        playerY = canvas.height - playerHeight - 10;
        fallingObjects = [];
        score = 0;
        update();
    }
});