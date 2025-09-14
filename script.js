// DOM Elements
const homePage = document.getElementById("home-page")
const gamePage = document.getElementById("game-page")
const playBtn = document.getElementById("play-btn")
const homeBtn = document.getElementById("home-btn")
const restartBtn = document.getElementById("restart-btn")
const pauseBtn = document.getElementById("pause-btn")
const playAgainBtn = document.getElementById("play-again-btn")
const scoreDisplay = document.getElementById("score")
const highScoreDisplay = document.getElementById("high-score")
const finalScoreDisplay = document.getElementById("final-score")
const gameOverScreen = document.querySelector(".game-over")
const canvas = document.getElementById("game-board")
const ctx = canvas.getContext("2d")

// Mobile control buttons
const upBtn = document.getElementById("up-btn")
const leftBtn = document.getElementById("left-btn")
const rightBtn = document.getElementById("right-btn")
const downBtn = document.getElementById("down-btn")

// Game variables
const gridSize = 20
const tileCount = canvas.width / gridSize
let snake = [{ x: 10, y: 10 }]
let food = { x: 5, y: 5 }
let direction = { x: 0, y: 0 }
let nextDirection = { x: 0, y: 0 }
let score = 0
let highScore = localStorage.getItem("snakeHighScore") || 0
let gameOver = false
let isPaused = false
let gameSpeed = 150
let gameInterval

// Initialize high score display
highScoreDisplay.textContent = highScore

// Event Listeners
playBtn.addEventListener("click", startGame)
homeBtn.addEventListener("click", goHome)
restartBtn.addEventListener("click", restartGame)
pauseBtn.addEventListener("click", togglePause)
playAgainBtn.addEventListener("click", restartGame)

// Mobile control events
upBtn.addEventListener("click", () => changeDirection({ x: 0, y: -1 }))
leftBtn.addEventListener("click", () => changeDirection({ x: -1, y: 0 }))
rightBtn.addEventListener("click", () => changeDirection({ x: 1, y: 0 }))
downBtn.addEventListener("click", () => changeDirection({ x: 0, y: 1 }))

// Keyboard control
document.addEventListener("keydown", (e) => {
  // Prevent scrolling with arrow keys
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault()
  }

  switch (e.key) {
    case "ArrowUp":
      changeDirection({ x: 0, y: -1 })
      break
    case "ArrowDown":
      changeDirection({ x: 0, y: 1 })
      break
    case "ArrowLeft":
      changeDirection({ x: -1, y: 0 })
      break
    case "ArrowRight":
      changeDirection({ x: 1, y: 0 })
      break
    case " ":
      togglePause()
      break
  }
})
 