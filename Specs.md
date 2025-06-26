# Game Specifications

## Scene 1: Start Screen

*   **Background:** Sky with clouds and a title.
*   **UI Elements:**
    *   An input field for the player to enter a nickname.
    *   A "Confirm" button.
*   **Action:**
    *   After the player enters a nickname and clicks "Confirm", the game transitions to the main game scene.

## Scene 2: Main Game

*   **Background:** Sky.
*   **Foreground:**
    *   A patch of grass at the bottom of the screen.
    *   A turret/cannon positioned on the grass.
*   **UI Elements:**
    *   A text input box at the very bottom of the screen. The player can type here and press Enter to submit.
    *   A score display at the top of the screen.
*   **Gameplay:**
    *   "Word clouds" continuously fall from the top of the screen.
    *   The player clicks on the turret to focus the text input.
    *   When the player types a word and presses Enter, the turret fires a projectile.
    *   If the projectile hits a matching word cloud, the cloud disappears, and the player's score increases.
    *   The objective is to eliminate as many word clouds as possible.

## Scene 3: Game Over

*   **Trigger:** A word cloud reaches the ground without being shot.
*   **UI Elements:**
    *   Displays the player's final score.
    *   Displays the player's rank.
    *   A "Restart" button to begin a new game.
*   **Data Persistence:**
    *   The game result (nickname, score) is saved to a local file named `result.txt`.
    *   This file stores a leaderboard of the top 50 scores.
