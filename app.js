document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  let nextRandom = 0;
  let timerId = 0;
  let score = 0;
  const colors = ["orange", "red", "purple", "green", "blue"];
  // The Bricks
  const lBrick = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];
  const zBrick = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tBrick = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oBrick = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iBrick = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theBricks = [
    lBrick,
    zBrick,
    tBrick,
    oBrick,
    iBrick,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  // randomly select a Brick and its first rotation

  let random = Math.floor(Math.random() * theBricks.length);
  let current = theBricks[random][0];

  //   draw the fBrick
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("Brick");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }
  // undraw the Bricks
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("Brick");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  //make Brick move down every second
  // timerId = setInterval(moveDown, 1000);

  //   assign functiona to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener("keyup", control);

  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  //freeze
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );

      //start a new Brick falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theBricks.length);
      current = theBricks[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  // keycode checker

  //move left
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) {
      currentPosition -= 1;
    }
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }
  //move right
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    if (!isAtRightEdge) {
      currentPosition += 1;
    }
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }
  //rotate
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theBricks[random][currentRotation];
    draw();
  }
  //show up next Brick
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  const displayIndex = 0;
  // Brick without rotation
  const upNextBricks = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lBrick
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zBrick
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tBrick
    [0, 1, displayWidth, displayWidth + 1], //oBrick
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iBrick
  ];

  //display shape in mini-grid
  function displayShape() {
    displaySquares.forEach((square) => {
      square.classList.remove("Brick");
      square.style.backgroundColor = "";
    });
    upNextBricks[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("Brick");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
      // console.log(displaySquares);
    });
  }
  // start/pause
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theBricks.length);
      displayShape();
    }
  });

  //add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("Brick");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        // console.log(squaresRemoved);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "end";
      clearInterval(timerId);
    }
  }
});
