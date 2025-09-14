// Initialize game variables
const gridSize = { width: 20, height: 20 }
let snake = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
]
let direction = { x: 1, y: 0 }
let food = generateFoodPosition()
let score = 0
let gameOver = false
let gameInterval

// Start the game
const startGame = () => {
  gameOver = false
  score = 0
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]
  direction = { x: 1, y: 0 }
  food = generateFoodPosition()
  document.getElementById("final-score").textContent = 0
  document.querySelector(".game-over").style.display = "none"
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
    snake.unshift({ ...snake[0] })
    food = generateFoodPosition()
  } else {
    snake.unshift({ ...snake[0] })
    snake.pop()
  }
  updateGameBoard()
}

const moveSnake = () => {
  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  }
  snake.unshift(newHead)
}

const checkCollisions = () => {
  const head = snake[0]
  if (
    head.x < 0 ||
    head.x >= gridSize.width ||
    head.y < 0 ||
    head.y >= gridSize.height
  ) {
    endGame()
    return
  }
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

const updateGameBoard = () => {
  const canvas = document.getElementById("game-board")
  if (!canvas) return
  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "green"
  snake.forEach((segment) => {
    ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18)
  })
  ctx.fillStyle = "red"
  ctx.fillRect(food.x * 20, food.y * 20, 18, 18)
  const scoreElement = document.getElementById("score")
  if (scoreElement) scoreElement.textContent = score
}

document.addEventListener("keydown", (event) => {
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

startGame()
