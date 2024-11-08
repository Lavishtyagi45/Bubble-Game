document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.querySelector("#start-screen");
  const difficultyScreen = document.querySelector("#difficulty-screen");
  const gameScreen = document.querySelector("#game-screen");
  const gameOverScreen = document.querySelector("#game-over-screen");
  const scorecardScreen = document.querySelector("#scorecard-screen");

  let selectedDifficulty = "";
  let score = 0;
  let timer = 30;
  let hitNumber = 0;
  let timerInterval;
  const maxScores = 5;

  const showScreen = (screen) => {
    document
      .querySelectorAll(".screen")
      .forEach((s) => s.classList.add("hidden"));
    screen.classList.remove("hidden");
  };

  // on click start button
  document.getElementById("start-btn").addEventListener("click", () => {
    showScreen(difficultyScreen);
  });

  // Difficulty selection
  document.querySelectorAll(".difficulty-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      selectedDifficulty = e.target.getAttribute("game-difficulty");
      console.log("Selected difficulty:", selectedDifficulty); // Debugging
      startGame(selectedDifficulty);
      showScreen(gameScreen);
    });
  });

  // back to start button
  document.getElementById("back-to-start").addEventListener("click", () => {
    showScreen(startScreen);
  });

  // Play again button
  document.getElementById("play-again-btn").addEventListener("click", () => {
    resetGame();
    showScreen(difficultyScreen); // Show difficulty selection again
  });

  // Back to main menu after game over
  document
    .getElementById("back-to-start-again")
    .addEventListener("click", () => {
      resetGame(); // Reset the game when going back to the main menu
      showScreen(startScreen); // Show the start screen
    });

  // View Scorecard
  document.getElementById("scorecard-btn").addEventListener("click", () => {
    updateScoreList();
    showScreen(scorecardScreen);
  });

  // Back from scorecard
  document
    .getElementById("back-from-scorecard")
    .addEventListener("click", () => {
      showScreen(startScreen);
    });

  // Game initialization
  function startGame(difficulty) {
    score = 0;
    timer = 30;

    initGame(difficulty);
    runTimer();
  }

  function initGame(difficulty) {
    // number of bubbles depend upon difficulty of game
    let numBubbles =
      difficulty === "easy" ? 24 : difficulty === "medium" ? 30 : 36;
    createBubbles(numBubbles);

    // number of bubbles in a row also depends upon difficulty of game
    bubbleContainer = document.getElementById("bubble-container");
    if (numBubbles == 24) {
      bubbleContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
    } else if (numBubbles == 30) {
      bubbleContainer.style.gridTemplateColumns = "repeat(5, 1fr)";
    } else {
      bubbleContainer.style.gridTemplateColumns = "repeat(6, 1fr)";
    }
    getNewHit(numBubbles);
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("timer").textContent = timer;
  }

  function createBubbles(num) {
    let clutter = "";
    const container = document.getElementById("bubble-container");
    let mode = num == 24 ? 1 / 2 : num == 30 ? 8 / 10 : 1;
    for (let i = 0; i < num; i++) {
      const randomNumber = Math.floor(Math.random() * 10 * mode);
      clutter += `<div class="bubble">${randomNumber}</div>`;
    }
    container.innerHTML = clutter;

    document.querySelectorAll(".bubble").forEach((bubble) => {
      bubble.addEventListener("click", () => {
        if (Number(bubble.textContent) === hitNumber) {
          score++;
          bubble.classList.add("clicked");
          document.getElementById("score").textContent = `Score: ${score}`;
          createBubbles(num); // Recreate the bubbles
          getNewHit(num); // Generate a new hit number
        }
      });
    });
  }

  function getNewHit(num) {
    let mode = num == 24 ? 1 / 2 : num == 30 ? 8 / 10 : 1;
    hitNumber = Math.floor(Math.random() * 10 * mode);
    document.getElementById("hit-display").textContent = `Hit: ${hitNumber}`;
  }

  // Timer function
  function runTimer() {
    timerInterval = setInterval(() => {
      if (timer > 0) {
        timer--;
        document.getElementById("timer").textContent = timer;
        if (timer <= 10) {
          document.getElementById("timer").classList.add("flash");
        }
      } else {
        clearInterval(timerInterval);
        gameOver();
      }
    }, 1000);
  }

  function gameOver() {
    document.getElementById("final-score").textContent = `Your Score: ${score}`;
    saveScore(score); // Save score in localStorage when the game ends
    clearInterval(timerInterval); // Stop the timer
    showScreen(gameOverScreen);
  }

  // Save the score in localStorage
  function saveScore(newScore) {
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    highScores.push(newScore);
    highScores.sort((a, b) => b - a); // Sort scores in descending order
    if (highScores.length > maxScores) {
      highScores.splice(maxScores); // Keep only the top 5 scores
    }
    localStorage.setItem("highScores", JSON.stringify(highScores)); // Save back to localStorage
  }

  // Update score list from localStorage
  function updateScoreList() {
    const scoreList = document.getElementById("score-list");
    scoreList.innerHTML = ""; // Clear the list first

    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    highScores.forEach((scoreItem, index) => {
      const li = document.createElement("li");
      li.textContent = `#${index + 1} - ${scoreItem}`;
      scoreList.appendChild(li);
    });
  }

  // Reset the game state
  function resetGame() {
    score = 0;
    timer = 30;
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("timer").textContent = timer;
    document.getElementById("hit-display").textContent = `Hit: 0`;

    clearInterval(timerInterval); // Ensure the old timer is cleared
    document.getElementById("bubble-container").innerHTML = ""; // Clear bubbles
    document.getElementById("timer").classList.remove("flash"); // Remove flash effect
  }
});
