const SnakeGameApp = () => {
  const [currentPage, setCurrentPage] = useState("home")
}

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(150);

  const gameIntervalRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const gridSize = 20;
  const tileCount = 20;
}


useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext('2d');
      placeFood();
      startGame();
    }
  }, []);
