import { useEffect, useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, isHighLight }) {
  console.log(isHighLight);
  if (isHighLight) {
    return (
      <button className="square highlight" onClick={onSquareClick}>
        {value}
      </button>
    )
  }
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  // TODO: Cải biến code, có thể custom size của board game và xử lý sự kiện thắng
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // Detect 3 cell cùng bằng X hoặc cùng bằng O
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null
}

function Board({ xIsNext, squares, onPlay }) {
  let winner = calculateWinner(squares)
  let status;
  let highLight = Array(9).fill(null)


  let checkedSquares = 0
  for (let square of squares) {
    if (square) checkedSquares++
    else {
      break
    }
  }

    if (winner) {
      status = `Winner: ${xIsNext ? "O" : "X"}`;
      highLight[winner[0]] = 1
      highLight[winner[1]] = 1
      highLight[winner[2]] = 1
    } else if (checkedSquares == 9) {
      status = `Không có người thắng cuộc!`
    } else {
      status = `Next player: ${xIsNext ? "X" : "O"}`
    }

  function handleClick(i) {
    // Khi có winner thì disabled các cell
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();

    if (!nextSquares[i]) {
      nextSquares[i] = xIsNext ? "X" : "O";
    }
    onPlay(nextSquares);
  }
  return (
    <>
      <div className="status">{status}</div>
      {[...Array(3)].map(function (object, i) {
        return (
          <div className='board-row'>
            {[...Array(3)].map(function (object, j) {
              return (
                <Square isHighLight={highLight[j + 3 * i]} key={j + 3 * i} value={squares[j + 3 * i]} onSquareClick={() => handleClick(j + 3 * i)} />
              )
            })}
          </div>
        )
      })}
    </>
  )
}


export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [highLight, setHighLight] = useState(Array(9).fill(null));
  const [currentMove, setCurrentMove] = useState(0)
  const [isReverseHistory, setIsReverseHistory] = useState(false);
  const currentSquares = history[currentMove];
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }
  function handleHighLight(idx) {
    let nextHighLight = highLight.slice()
    nextHighLight[idx] = 1
    setHighLight(nextHighLight)
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
    setXIsNext(nextMove % 2 === 0)
  }
  function reverseHistory() {
    setHistory(history.reverse())
    setIsReverseHistory(!isReverseHistory)
  }
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      console.log(history.length);
      description = isReverseHistory ? 'Go to move #' + (squares.length - move) : 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })
  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} highLight={highLight} onHighLight={handleHighLight} />
      </div>
      <div className='game-info'>
        <button onClick={() => reverseHistory()}>Reverse History</button>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}