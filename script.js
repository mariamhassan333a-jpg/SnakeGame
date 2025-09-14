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

// Touch swipe detection for mobile
let touchStartX = 0
let touchStartY = 0

canvas.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
    e.preventDefault()
  },
  { passive: false }
)

canvas.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault()
  },
  { passive: false }
)

canvas.addEventListener(
  "touchend",
  (e) => {
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY

    const dx = touchEndX - touchStartX
    const dy = touchEndY - touchStartY

    // Minimum swipe distance
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        changeDirection({ x: Math.sign(dx), y: 0 })
      } else {
        // Vertical swipe
        changeDirection({ x: 0, y: Math.sign(dy) })
      }
    }

    e.preventDefault()
  },
  { passive: false }
)

// Functions
function startGame() {
  homePage.style.display = "none"
  gamePage.style.display = "block"
  resetGame()
  gameInterval = setInterval(gameLoop, gameSpeed)
}

function goHome() {
  clearInterval(gameInterval)
  homePage.style.display = "block"
  gamePage.style.display = "none"
}

function resetGame() {
  snake = [{ x: 10, y: 10 }]
  food = generateFood()
  direction = { x: 0, y: 0 }
  nextDirection = { x: 0, y: 0 }
  score = 0
  gameOver = false
  isPaused = false
  scoreDisplay.textContent = score
  gameOverScreen.style.display = "none"
  pauseBtn.textContent = "Pause"
}

function restartGame() {
  clearInterval(gameInterval)
  resetGame()
  gameInterval = setInterval(gameLoop, gameSpeed)
}

function togglePause() {
  isPaused = !isPaused
  pauseBtn.textContent = isPaused ? "Resume" : "Pause"
}

function changeDirection(newDirection) {
  // Prevent reversing direction
  if (newDirection.x !== -direction.x && newDirection.y !== -direction.y) {
    nextDirection = newDirection
  }
}

function gameLoop() {
  if (isPaused || gameOver) return

  // Update direction
  direction = nextDirection

  // If not moving, don't update
  if (direction.x === 0 && direction.y === 0) return

  // Move snake
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }

  // Check for game over conditions
  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver = true
    clearInterval(gameInterval)

    // Update high score if needed
    if (score > highScore) {
      highScore = score
      localStorage.setItem("snakeHighScore", highScore)
      highScoreDisplay.textContent = highScore
    }

    // Show game over screen
    finalScoreDisplay.textContent = score
    gameOverScreen.style.display = "flex"
    return
  }

  // Add new head
  snake.unshift(head)

  // Check if food eaten
  if (head.x === food.x && head.y === food.y) {
    // Increase score
    score += 10
    scoreDisplay.textContent = score

    // Generate new food
    food = generateFood()

    // Increase speed slightly every 50 points
    if (score % 50 === 0) {
      clearInterval(gameInterval)
      gameSpeed = Math.max(50, gameSpeed - 10)
      gameInterval = setInterval(gameLoop, gameSpeed)
    }
  } else {
    // Remove tail if no food eaten
    snake.pop()
  }

  // Draw game
  draw()
}

function generateFood() {
  let newFood
  let foodOnSnake

  do {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    }

    foodOnSnake = snake.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y
    )
  } while (foodOnSnake)

  return newFood
}

function draw() {
  // Clear canvas
  ctx.fillStyle = "#0c2461"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
  ctx.lineWidth = 0.5

  for (let x = 0; x < tileCount; x++) {
    for (let y = 0; y < tileCount; y++) {
      ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize)
    }
  }

  // Draw snake
  snake.forEach((segment, index) => {
    // Head is a different color
    if (index === 0) {
      ctx.fillStyle = "#4cd137"
    } else {
      // Gradient body color
      const greenValue = Math.max(100, 255 - index * 5)
      ctx.fillStyle = `rgb(76, ${greenValue}, 55)`
    }

    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 1,
      gridSize - 1
    )

    // Eyes on head
    if (index === 0) {
      ctx.fillStyle = "white"
      ctx.beginPath()

      // Adjust eye position based on direction
      const eyeOffset = 5
      let eyeX1, eyeY1, eyeX2, eyeY2

      if (direction.x === 1) {
        // Right
        eyeX1 = (segment.x + 0.7) * gridSize
        eyeY1 = (segment.y + 0.3) * gridSize
        eyeX2 = (segment.x + 0.7) * gridSize
        eyeY2 = (segment.y + 0.7) * gridSize
      } else if (direction.x === -1) {
        // Left
        eyeX1 = (segment.x + 0.3) * gridSize
        eyeY1 = (segment.y + 0.3) * gridSize
        eyeX2 = (segment.x + 0.3) * gridSize
        eyeY2 = (segment.y + 0.7) * gridSize
      } else if (direction.y === 1) {
        // Down
        eyeX1 = (segment.x + 0.3) * gridSize
        eyeY1 = (segment.y + 0.7) * gridSize
        eyeX2 = (segment.x + 0.7) * gridSize
        eyeY2 = (segment.y + 0.7) * gridSize
      } else {
        // Up
        eyeX1 = (segment.x + 0.3) * gridSize
        eyeY1 = (segment.y + 0.3) * gridSize
        eyeX2 = (segment.x + 0.7) * gridSize
        eyeY2 = (segment.y + 0.3) * gridSize
      }

      ctx.arc(eyeX1, eyeY1, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(eyeX2, eyeY2, 2, 0, Math.PI * 2)
      ctx.fill()
    }
  })

  // Draw food
  ctx.fillStyle = "#e74c3c"
  ctx.beginPath()
  ctx.arc(
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2,
    gridSize / 2 - 1,
    0,
    Math.PI * 2
  )
  ctx.fill()
}

// Initial setup for responsive design
function setupCanvas() {
  const container = document.querySelector(".canvas-container")
  if (window.innerWidth < 600) {
    canvas.width = 300
    canvas.height = 300
  } else {
    canvas.width = 400
    canvas.height = 400
  }

  if (!gameOver && !isPaused) {
    draw()
  }
}

window.addEventListener("resize", setupCanvas)
setupCanvas()
