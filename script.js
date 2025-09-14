// Initialize game variables
const gridSize = { width: 20, height: 20 }
let snake = [
  { x: 10, y: 10 },
  { x: 10, y: 9 },
  { x: 10, y: 8 },
]
let direction = { x: 1, y: 0 } // Corrected: Start moving to the right
let food = generateFoodPosition()
let score = 0
let gameOver = false
let gameInterval
// The soundEffect object is assumed to be defined elsewhere in the HTML file.
const soundEffect = {
  eatFoodSound: { play: () => console.log("Eating food!") }, // Placeholder
  loseGameSound: { play: () => console.log("Game over!") }, // Placeholder
}
// Start the game
const startGame = () => {
  gameOver = false
  score = 0
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ] // Corrected: Initial snake segments align with rightward movement
  direction = { x: 1, y: 0 } // Corrected: Initial direction to the right
  food = generateFoodPosition()
  document.getElementById("final-score").textContent = 0
  document.querySelector(".game-over").style.display = "none"
  // Clear any existing interval to prevent multiple game loops
  if (gameInterval) clearInterval(gameInterval)
  gameInterval = setInterval(gameLoop, 100)
}

// Game loop
const gameLoop = () => {
  if (gameOver) return

  moveSnake()
  checkCollisions()

  if (gameOver) return

  if (checkFoodCollision()) {
    score++
    soundEffect.eatFoodSound.play()
    snake.unshift({ ...snake[0] }) // Grow the snake
    food = generateFoodPosition()
    // Generate new food
  } else {
    snake.unshift({ ...snake[0] }) // Move snake forward
    snake.pop() // Remove tail
  }

  updateGameBoard()
}

// Move the snake based on the current direction
const moveSnake = () => {
  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  }
  snake.unshift(newHead) // Add new head
}

// Check for collisions
const checkCollisions = () => {
  const head = snake[0]

  // Check for wall collisions
  if (
    head.x < 0 ||
    head.x >= gridSize.width ||
    head.y < 0 ||
    head.y >= gridSize.height
  ) {
    endGame()
    return
  }

  // Check for self collisions
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame()
      return
    }
  }
}

const endGame = () => {
  gameOver = true
  soundEffect.loseGameSound.play()
  document.querySelector(".game-over").style.display = "flex"
  document.getElementById("final-score").textContent = score
  clearInterval(gameInterval)
}

// Check if the snake has eaten the food
const checkFoodCollision = () => {
  const head = snake[0]
  return head.x === food.x && head.y === food.y
}

// Generate food position
const generateFoodPosition = () => {
  let newFoodPosition
  do {
    newFoodPosition = {
      x: Math.floor(Math.random() * gridSize.width),
      y: Math.floor(Math.random() * gridSize.height),
    }
  } while (
    snake.some(
      (segment) =>
        segment.x === newFoodPosition.x && segment.y === newFoodPosition.y
    )
  )
  return newFoodPosition
}

// Update the game board
const updateGameBoard = () => {
  const canvas = document.getElementById("game-board")
  if (!canvas) return // Add a check to ensure canvas exists
  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw the snake
  ctx.fillStyle = "green"
  snake.forEach((segment) => {
    ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18)
  })

  // Draw the food
  ctx.fillStyle = "red"
  ctx.fillRect(food.x * 20, food.y * 20, 18, 18)

  // Update the score display
  const scoreElement = document.getElementById("score")
  if (scoreElement) scoreElement.textContent = score
}

// Listen for user input (keyboard)
document.addEventListener("keydown", (event) => {
  // Prevent the snake from reversing on itself
  switch (event.key) {
    case "ArrowUp":
      if (direction.y !== 1) direction = { x: 0, y: -1 }
      break
    case "ArrowDown":
      if (direction.y !== -1) direction = { x: 0, y: 1 }
      break
    case "ArrowLeft":
      if (direction.x !== 1) direction = { x: -1, y: 0 }
      break
    case "ArrowRight":
      if (direction.x !== -1) direction = { x: 1, y: 0 }
      break
  }
})

// Mobile controls
const upBtn = document.getElementById("up-btn")
const downBtn = document.getElementById("down-btn")
const leftBtn = document.getElementById("left-btn")
const rightBtn = document.getElementById("right-btn")

if (upBtn)
  upBtn.addEventListener("click", () => {
    if (direction.y !== 1) direction = { x: 0, y: -1 }
  })
if (downBtn)
  downBtn.addEventListener("click", () => {
    if (direction.y !== -1) direction = { x: 0, y: 1 }
  })
if (leftBtn)
  leftBtn.addEventListener("click", () => {
    if (direction.x !== 1) direction = { x: -1, y: 0 }
  })
if (rightBtn)
  rightBtn.addEventListener("click", () => {
    if (direction.x !== -1) direction = { x: 1, y: 0 }
  })

// Pause and restart functionality
const pauseBtn = document.getElementById("pause-btn")
const restartBtn = document.getElementById("restart-btn")
const playAgainBtn = document.getElementById("play-again-btn")

if (pauseBtn)
  pauseBtn.addEventListener("click", () => {
    if (!gameOver) {
      clearInterval(gameInterval)
    }
  })

if (restartBtn) restartBtn.addEventListener("click", startGame)
if (playAgainBtn) playAgainBtn.addEventListener("click", startGame)

// Start the game when the page loads
startGame()
