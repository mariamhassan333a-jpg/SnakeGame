// =======================
// متغيرات اللعبة الأساسية
// =======================
const gridSize = { width: 20, height: 20 }
let snake = []
let direction = { x: 0, y: 1 } // الاتجاه الابتدائي: للأسفل
let food = null
let score = 0
let gameOver = false
let gameInterval = null
// سرعة اللعبة (كل 300 مللي ثانية تتحرك الثعبان)
const gameSpeed = 300

// =======================

// =======================
// تهيئة اللعبة (إعادة تعيين المتغيرات)
// =======================
const initializeGame = () => {
  snake = [
    { x: 10, y: 10 },
    { x: 10, y: 9 },
    { x: 10, y: 8 },
  ]
  direction = { x: 0, y: 1 }
  food = generateFoodPosition()
  score = 0
  gameOver = false
  updateScoreDisplay()
  hideGameOverScreen()
}

// =======================
// توليد موقع عشوائي للطعام
// =======================
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

// =======================
// تحديث عرض النقاط
// =======================
const updateScoreDisplay = () => {
  const scoreElement = document.getElementById("score")
  if (scoreElement) scoreElement.textContent = score
}

// =======================
// إظهار شاشة انتهاء اللعبة
// =======================
const showGameOverScreen = () => {
  const gameOverDiv = document.querySelector(".game-over")
  if (gameOverDiv) gameOverDiv.style.display = "flex"

  const finalScoreSpan = document.getElementById("final-score")
  if (finalScoreSpan) finalScoreSpan.textContent = score
}

// =======================
// إخفاء شاشة انتهاء اللعبة
// =======================
const hideGameOverScreen = () => {
  const gameOverDiv = document.querySelector(".game-over")
  if (gameOverDiv) gameOverDiv.style.display = "none"
}

// =======================
// تحديث لوحة اللعبة (الرسم على الكانفاس)
// =======================
const updateGameBoard = () => {
  const canvas = document.getElementById("game-board")
  if (!canvas) return
  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // رسم الثعبان
  ctx.fillStyle = "green"
  snake.forEach((segment) => {
    ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18)
  })

  // رسم الطعام
  ctx.fillStyle = "red"
  ctx.fillRect(food.x * 20, food.y * 20, 18, 18)
}

// =======================
// تحريك الثعبان
// =======================
const moveSnake = () => {
  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  }
  snake.unshift(newHead)
}

// =======================
// التحقق من التصادمات (الجدران أو الذيل)
// =======================
const checkCollisions = () => {
  const head = snake[0]

  // تصادم مع الجدران
  if (
    head.x < 0 ||
    head.x >= gridSize.width ||
    head.y < 0 ||
    head.y >= gridSize.height
  ) {
    return true
  }

  // تصادم مع الذيل
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true
    }
  }

  return false
}

// =======================
// التحقق من أكل الطعام
// =======================
const checkFoodCollision = () => {
  const head = snake[0]
  return head.x === food.x && head.y === food.y
}

// =======================
// الحلقة الرئيسية للعبة
// =======================
const gameLoop = () => {
  if (gameOver) return

  moveSnake()

  if (checkCollisions()) {
    gameOver = true
    soundEffect.loseGameSound.play()
    showGameOverScreen()
    clearInterval(gameInterval)
    return
  }

  if (checkFoodCollision()) {
    score++
    soundEffect.eatFoodSound.play()
    food = generateFoodPosition()
    updateScoreDisplay()
  } else {
    snake.pop() // إزالة الذيل إذا لم يأكل الطعام
  }

  updateGameBoard()
}

// =======================
// بدء اللعبة
// =======================
const startGame = () => {
  initializeGame()
  clearInterval(gameInterval)
  gameInterval = setInterval(gameLoop, gameSpeed) // ← هنا سرعة الحركة 300 مللي ثانية
}

// =======================
// التحكم عبر لوحة المفاتيح
// =======================
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 }
      break
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 }
      break
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 }
      break
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 }
      break
  }
})

// =======================
// التحكم عبر أزرار الموبايل
// =======================
const upBtn = document.getElementById("up-btn")
const downBtn = document.getElementById("down-btn")
const leftBtn = document.getElementById("left-btn")
const rightBtn = document.getElementById("right-btn")

if (upBtn)
  upBtn.addEventListener("click", () => {
    if (direction.y === 0) direction = { x: 0, y: -1 }
  })
if (downBtn)
  downBtn.addEventListener("click", () => {
    if (direction.y === 0) direction = { x: 0, y: 1 }
  })
if (leftBtn)
  leftBtn.addEventListener("click", () => {
    if (direction.x === 0) direction = { x: -1, y: 0 }
  })
if (rightBtn)
  rightBtn.addEventListener("click", () => {
    if (direction.x === 0) direction = { x: 1, y: 0 }
  })

// =======================
// أزرار الإيقاف المؤقت، إعادة التشغيل، والعودة للصفحة الرئيسية
// =======================
const pauseBtn = document.getElementById("pause-btn")
const restartBtn = document.getElementById("restart-btn")
const playAgainBtn = document.getElementById("play-again-btn")
const homeBtn = document.getElementById("home-btn")

if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    if (!gameOver) {
      clearInterval(gameInterval)
    }
  })
}

if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    startGame()
  })
}

if (playAgainBtn) {
  playAgainBtn.addEventListener("click", () => {
    startGame()
  })
}

if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    window.location.href = "index.html"
  })
}

// =======================
// بدء اللعبة عند تحميل الصفحة
// =======================
window.addEventListener("load", () => {
  startGame()
})
