import { useEffect, useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, isHighLight }) {
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

function calculateWinner(squares, size, len) {
  // TODO: Cải biến code, có thể custom size của board game và xử lý sự kiện thắng
  let listWinCase = []
  let tempWinCase = []

  // Case 1 hàng ngang
  for (let i = 0; i <= size * size; i++) {
    if (size - i % size >= len - 1 && i % size != 0) {
      tempWinCase = []
      for (let j = i; j < i + len; j++) {
        tempWinCase.push(j - 1)
      }
      listWinCase.push(tempWinCase)
    }
  }

  // Case đường chéo phụ
  for (let i = len; i <= size * size; i++) {
    if (i % size >= len || i % size == 0) {
      if (i < size * size - (size * (len - 1) - 1)) {
        tempWinCase = []
        for (let j = i; j <= i + (size - 1) * (len - 1); j += size - 1) {
          tempWinCase.push(j - 1);
        }
        listWinCase.push(tempWinCase)
      }
    }
  }

  // Case đường chéo chính
  for (let i = 1; i <= size * size; i++) {
    if (size - i % size >= len - 1 && i % size != 0) {
      if (i < size * size - (size * (len - 1) - 1)) {
        tempWinCase = []
        for (let j = i; j <= i + (size + 1) * (len - 1); j += size + 1) {
          tempWinCase.push(j - 1);
        }
        listWinCase.push(tempWinCase)
      }
    }
  }

  // Case hàng dọc
  for (let i = 1; i < size * size - (size * (len - 1) - 1); i++) {

    tempWinCase = []
    for (let j = i; j <= i + size * (len - 1); j += size) {
      tempWinCase.push(j - 1);
    }
    listWinCase.push(tempWinCase)
  }

  for (let i = 0; i < listWinCase.length; i++) {
    let lst = listWinCase[i].slice()
    let c = 0;
    for (let j = 0; j < lst.length; j++) {
      if (squares[lst[j]] == 'X') {
        c++;
      }
    }
    if (c == len) {
      return lst
    }
  }
  for (let i = 0; i < listWinCase.length; i++) {
    let lst = listWinCase[i].slice()
    let c = 0;
    for (let j = 0; j < lst.length; j++) {
      if (squares[lst[j]] == 'O') {
        c++;
      }
    }
    if (c == len) {
      return lst
    }
  }
  return null
}

function Board({ xIsNext, squares, onPlay, size, len }) {
  let winner = calculateWinner(squares, size, len)
  let status;
  let highLight = Array(size * size).fill(null)


  let checkedSquares = 0
  for (let square of squares) {
    if (square) checkedSquares++
    else {
      break
    }
  }

  if (winner) {
    status = `Winner: ${xIsNext ? "O" : "X"}`;
    for (let i of winner) {
      highLight[i] = 1
    }
  } else if (checkedSquares === size * size) {
    status = `Không có người thắng cuộc!`
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`
  }

  function handleClick(i) {
    // Khi có winner thì disabled các cell
    if (squares[i] || calculateWinner(squares, size, len)) {
      return;
    }
    const nextSquares = squares.slice();

    if (!nextSquares[i]) {
      nextSquares[i] = xIsNext ? "X" : "O";
    }
    onPlay(nextSquares, i);
  }
  return (
    <>
      <div className="status">{status}</div>
      {[...Array(size)].map(function (object, i) {
        return (
          <div className='board-row'>
            {[...Array(size)].map(function (object, j) {
              return (
                <Square isHighLight={highLight[j + size * i]} key={j + 3 * i} value={squares[j + size * i]} onSquareClick={() => handleClick(j + size * i)} />
              )
            })}
          </div>
        )
      })}
    </>
  )
}


function Game({ size, len }) {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [highLight, setHighLight] = useState(Array(9).fill(null));
  const [currentMove, setCurrentMove] = useState(0)
  const [listMove, setListMove] = useState([])
  const currentSquares = history[currentMove];
  useEffect(() => {
    setHistory([Array(size * size).fill(null)])
    setHighLight(Array(size * size).fill(null))
  }, [size])
  function handlePlay(nextSquares, i) {
    console.log(i);
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
    let nextListMove = listMove.slice();
    nextListMove.push(i);
    setListMove(nextListMove);
  }
  console.log(listMove);
  function handleHighLight(idx) {
    let nextHighLight = highLight.slice()
    nextHighLight[idx] = 1
    setHighLight(nextHighLight)
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
    setXIsNext(nextMove % 2 === 0)
  }
  const moves = listMove.slice(0, 10).map(function(move, i){
    return (
      i % 2 == 0 ? (
        <li key={move}>
          X selected {move}
        </li>
      ) : (
        <li key={move}>
          O selected {move}
        </li>
      )
    )
  })
  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} highLight={highLight} onHighLight={handleHighLight} size={size} len={len} />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function Menu({ size, setSize, len, setLen, setIsMenu }) {
  return (
    <div className='menu-container'>
      <div className='item-menu-container'>
        <button className='action-btn' onClick={() => { setSize(size - 1) }}>&lt;</button>
        <div className='outline-btn'>
          <button className='menu-btn'>Size: {size}</button>
        </div>
        <button className='action-btn' onClick={() => { setSize(size + 1) }}>&gt;</button>
      </div>
      <div className='item-menu-container'>
        <button className='action-btn' onClick={() => { setLen(len - 1) }}>&lt;</button>
        <div className='outline-btn'>
          <button className='menu-btn'>Length to win: {len}</button>
        </div>
        <button className='action-btn' onClick={() => { setLen(len + 1) }}>&gt;</button>
      </div>
      <div className='item-menu-container'>
        <button className='menu-btn' onClick={() => { setIsMenu(false) }}>Start</button>
      </div>
    </div>
  )
}

export default function App() {
  const [size, setSize] = useState(3)
  const [len, setLen] = useState(3)
  const [isMenu, setIsMenu] = useState(true)
  return (
    <div className='app-container'>
      {
        isMenu ? (
          <Menu size={size} setSize={setSize} len={len} setLen={setLen} setIsMenu={setIsMenu} />
        ) : (
          <Game size={size} len={len} />
        )
      }
    </div>
  )
}