const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let allCells = document.querySelectorAll('.cell');

const player = (name, sign, turn) => {
  return { name, sign, turn };
};

let humanPlayer;

let playerTwo;
let board = Array.from({ length: 9 }, (value, index) => index);

const emptySquares = () => {
  let newBoard = [];
  board.forEach((cell) => {
    if (typeof cell !== 'string') newBoard.push(cell);
  });
  return newBoard;
};

const bestSpotRandom = () => {
  return emptySquares()[Math.floor(Math.random() * emptySquares().length)];
};

function checkForTie() {
  if (emptySquares(board).length == 0) {
    return true;
  }
  return false;
}

function checkForWin(sign) {
  const allPlayerIndexes = [];

  board.forEach((element, index) => {
    if (element == sign) allPlayerIndexes.push(index);
  });

  for (let [index, element] of winCombinations.entries()) {
    if (element.every((item) => allPlayerIndexes.includes(item))) {
      return { index, element };
    }
  }
  return;
}

function updateResult(text) {
  let result = document.querySelector('.result');
  result.style.display = text ? 'block' : 'none';
  result.innerText = text;
}

function updateSpot(index, player) {
  board[index] = player.sign;
  allCells[index].innerText = player.sign;
  // console.log(board, allCells[index].innerText);

  let winObject = checkForWin(player.sign);
  if (winObject) {
    console.log(winObject);
    if (player == humanPlayer) updateResult(`player ${1} wins`);
    else if (player == playerTwo) {
      updateResult(`player ${2} wins`);
    }
    for (let elementIndex of winObject.element) {
      allCells[
        elementIndex
      ].style.backgroundColor = `rgba(${140}, ${170},${150}, ${0.6})`;
    }

    allCells.forEach((cell) =>
      cell.removeEventListener('click', playerClick, false)
    );
    return true;
  } else if (checkForTie()) {
    //check for tie
    updateResult('Tie Game');
    allCells.forEach((cell) =>
      cell.removeEventListener('click', playerClick, false)
    );
  }
}

function toggleTurns() {
  function toggleTurn(player) {
    return !player.turn;
  }
  humanPlayer.turn = toggleTurn(humanPlayer);
  playerTwo.turn = toggleTurn(playerTwo);
}

function playerClick(e) {
  if (typeof board[e.target.id] == 'number' && humanPlayer.turn) {
    let win = updateSpot(e.target.id, humanPlayer);
    if (!win) {
      toggleTurns();
      if (playerTwo.name == 'randomAI' && playerTwo.turn) {
        updateSpot(bestSpotRandom(), playerTwo);
        toggleTurns();
      }
    }
  } else {
    playerTwoClick(e);
    toggleTurns();
  }
}

function playerTwoClick(e) {
  if (typeof board[e.target.id] == 'number') {
    updateSpot(e.target.id, playerTwo);
  }
}

let choice;
function startGame(e) {
  e.preventDefault();

  choice = document.querySelector('#challenger').value;
  humanPlayer = player('farid', 'X', true);
  if (choice == 'randomAI') {
    playerTwo = player('randomAI', 'O', false);
  } else {
    playerTwo = player('anotherHuman', 'O', false);
  }

  for (let i = 0; i < allCells.length; i++) {
    allCells[i].addEventListener('click', playerClick);
  }
}

document.querySelector('.start').addEventListener('click', startGame);

function resetGame(e) {
  e.preventDefault();
  for (let cell of allCells) {
    cell.removeEventListener('click', playerClick);
    cell.innerText = '';
    updateResult('');
    allCells.forEach((cell) => {
      cell.style.backgroundColor = 'white';
    });
  }
  board = Array.from({ length: 9 }, (value, index) => index);
  playerTwo = null;
}

let reset = document.getElementsByClassName('danger')[0];
reset.addEventListener('click', resetGame);
