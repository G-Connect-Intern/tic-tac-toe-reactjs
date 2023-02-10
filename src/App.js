import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, isHighLight }) {
  if (isHighLight) {
    return (
      <button className="square" onClick={onSquareClick}>
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
  // Cải biến code, có thể custom size của board game và xử lý sự kiện thắng
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
      return squares[a];
    }
  }
  return null
}

function Board({ xIsNext, squares, onPlay, highLight }) {

  let winner = calculateWinner(squares)
  let status;

  if (winner) {
    status = `Winner: ${winner}`
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) { // Khi có winner thì disabled các cell
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
  const [highLight, setHighLight] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0)
  const [isReverseHistory, setIsReverseHistory] = useState(false);
  const currentSquares = history[currentMove];
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
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
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} highLight={highLight} />
      </div>
      <div className='game-info'>
        <button onClick={() => reverseHistory()}>Reverse History</button>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}