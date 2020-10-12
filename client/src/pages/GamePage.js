import React, { useEffect, useState } from 'react';
import { calculateWinner } from './calculateWinner';
import Board from './Board';

const styles = {
  width: '200px',
  margin: '20px auto',
};

// export const GamePage = () => {
//   const [step, setStap] = useState();

//   return (
//     <Row className='justify-content-md-center'>
//       <Col xs lg='6' className=' mt-5'>
//         UHDFS
//       </Col>
//     </Row>
//   )
// }

export const GamePage = () => {
  const [board, setBoard] = useState([null, null, null, null, null, null, "X", "O", "X"]);
  const [xIsNext, setXisNext] = useState(true);
  const winner = calculateWinner(board); //каждый раз

  //start state
  useEffect(() => {
    let arrX = 0, arrY = 0;

    board.forEach(item => {
      if (item === "X") {
        arrX++
      }
      if (item === "O") {
        arrY++
      }
    })

    if (arrX > arrY) {
      setXisNext(false)
    }
  }, [])

  const handleClick = i => {
    if (winner || board[i]) return;

    board[i] = xIsNext ? 'X' : 'O';
    setBoard(prev => board);
    setXisNext(prev => !xIsNext);

    // draw
    if (board.indexOf(null) === -1) {
      console.log('draw')
    }
  }
  const newGame = () => {
    setBoard(Array(9).fill(null));
    setXisNext(true);
  }

  return (
    <>
      <Board squares={board} onClick={handleClick} />

      <div style={styles}>
        <p>{winner ? 'Winner: ' + winner : 'Next Player: ' + (xIsNext ? 'X' : 'O')}</p>
        <button onClick={newGame}>
          New game
        </button>
      </div>
    </>
  )
}