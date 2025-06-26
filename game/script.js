import * as THREE from 'three';
import { FontLoader } from 'fontLoader';
import { TextGeometry } from 'textGeometry';
import { RoundedBoxGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/geometries/RoundedBoxGeometry.js';

// --- Agent1: Code Developer ---
// This agent is responsible for writing the initial code and adding comments.

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });

// Set renderer size and append to body
renderer.setSize(window.innerWidth, window.innerHeight);

// Camera position
camera.position.z = 5;

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

// Add directional light (for sun/shadows)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // White light
directionalLight.position.set(5, 10, 7); // Position the light source
directionalLight.castShadow = true; // Enable shadow casting
scene.add(directionalLight);

// Configure shadow properties for better quality
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;

// Enable shadows in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows

// Game state variables
let score = 0;
let nickname = '';
let gameStarted = false;
let gameOver = false;

// Game elements
let wordCloud;
const wordClouds = [];
const words = ["hello", "world", "three", "js", "game", "agent"]; // Example words

// DOM elements
const startScreen = document.getElementById('startScreen');
const nicknameInput = document.getElementById('nicknameInput');
const startButton = document.getElementById('startButton');
const gameOverlay = document.getElementById('gameOverlay');
const scoreDisplay = document.getElementById('score');
const wordInput = document.getElementById('wordInput');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const rankDisplay = document.getElementById('rank');
const restartButton = document.getElementById('restartButton');

// Event Listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
wordInput.addEventListener('keydown', handleWordInput);

// --- Agent3: Code Optimizer/Refiner ---
// This agent refines and optimizes the code, implementing game elements and logic.

// Add sky (background color)
scene.background = new THREE.Color(0x87CEEB); // Sky blue

// Add grass plane
const grassGeometry = new THREE.PlaneGeometry(20, 10);
const grassMaterial = new THREE.MeshBasicMaterial({ color: 0x7CFC00 }); // Lawn green
const grass = new THREE.Mesh(grassGeometry, grassMaterial);
grass.rotation.x = -Math.PI / 2; // Rotate to be horizontal
grass.position.y = -2; // Position below the camera
grass.receiveShadow = true; // Grass receives shadows
scene.add(grass);

// Add a simple turret (placeholder)
const turretGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const turretMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Gray, reacts to light
const turret = new THREE.Mesh(turretGeometry, turretMaterial);
turret.position.y = -1.5; // On the grass
turret.position.z = 4; // Slightly in front of the camera
turret.castShadow = true; // Turret casts shadows
scene.add(turret);

// Function to create a word cloud
function createWordCloud() {
    const word = words[Math.floor(Math.random() * words.length)];
    const geometry = new RoundedBoxGeometry(1.2, 0.6, 0.1, 0.1, 5); // Rounded box for word
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF }); // White
    const cloud = new THREE.Mesh(geometry, material);

    // Add text to the cloud
    const loader = new FontLoader();
    loader.load('https://cdn.jsdelivr.net/npm/three@0.165.0/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new TextGeometry(word, {
            font: font,
            size: 0.2, // Smaller text size
            height: 0.01,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(-0.5, -0.05, 0.06); // Adjust position to center text on cloud, slightly above surface
        cloud.add(textMesh);
        cloud.userData.word = word; // Store the word with the cloud
    });

    cloud.position.x = Math.random() * 10 - 5;
    cloud.position.y = 5;
    cloud.castShadow = true;
    scene.add(cloud);
    wordClouds.push(cloud);
}

// Game Loop
function animate() {
    requestAnimationFrame(animate);

    if (gameStarted && !gameOver) {
        // Move word clouds down
        wordClouds.forEach((cloud, index) => {
            cloud.position.y -= 0.01; // Falling speed

            // Check if word cloud hits the ground
            if (cloud.position.y < grass.position.y + 0.5) { // Adjust 0.5 for cloud height
                gameOver = true;
                gameOverlay.style.display = 'none';
                gameOverScreen.style.display = 'flex';
                finalScoreDisplay.textContent = `Your Score: ${score}`;
                // TODO: Implement rank and result.txt saving
            }
        });

        // Periodically create new word clouds
        if (Math.random() < 0.005) { // Adjust frequency
            createWordCloud();
        }
    }

    renderer.render(scene, camera);
}

// Start Game function
function startGame() {
    nickname = nicknameInput.value.trim();
    if (nickname) {
        startScreen.style.display = 'none';
        gameOverlay.style.display = 'flex';
        gameStarted = true;
        score = 0; // Reset score on new game
        scoreDisplay.textContent = `Score: ${score}`;
        wordInput.focus();
        // Clear existing word clouds
        wordClouds.forEach(cloud => scene.remove(cloud));
        wordClouds.length = 0; // Clear the array
        createWordCloud(); // Create initial word cloud
        animate(); // Start the animation loop
    } else {
        alert('Please enter a nickname!');
    }
}

// Restart Game function
function restartGame() {
    // Reset game state
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    gameOver = false;
    gameStarted = false; // Will be set to true again by startGame
    wordInput.value = '';
    gameOverScreen.style.display = 'none';
    startScreen.style.display = 'flex'; // Go back to start screen
    // Clear existing word clouds from scene and array
    wordClouds.forEach(cloud => scene.remove(cloud));
    wordClouds.length = 0;
}

// Handle Word Input
function handleWordInput(event) {
    if (event.key === 'Enter' && wordInput.value.trim() !== '') {
        const typedWord = wordInput.value.trim().toLowerCase(); // Convert to lowercase for matching
        let hit = false;
        wordClouds.forEach((cloud, index) => {
            if (cloud.userData.word && cloud.userData.word.toLowerCase() === typedWord) {
                // Hit! Remove cloud, increase score
                scene.remove(cloud);
                wordClouds.splice(index, 1);
                score += 10; // Example score increase
                scoreDisplay.textContent = `Score: ${score}`;
                hit = true;
                // TODO: Implement projectile animation
                return; // Exit forEach early if hit
            }
        });

        if (!hit) {
            console.log("Miss!");
            // TODO: Implement miss feedback
        }

        wordInput.value = ''; // Clear input after sending
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initial call to display start screen
startScreen.style.display = 'flex';
