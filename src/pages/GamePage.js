import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { useHttp } from '../hooks/http.hook';
import { calculate } from '../components/calculate';
import { Loader } from '../components/Loader';
import Board from '../components/Board';
import socket from '../socket';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

const styles = {
  width: '200px',
  margin: '20px auto',
};

export const GamePage = () => {
  const { request, loading } = useHttp();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXisNext] = useState(true);
  const [side, setSide] = useState('');
  const winner = calculate(board);
  const roomId = useParams().id;
  const history = useHistory();
  const [block, setBlock] = useState(false);
  const [move, setMove] = useState(true);
  const [change, setChange] = useState(false);
  const [stopZero, setStopZero] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [blockStep, setBlockStep] = useState(false);

  useEffect(() => {
    if (winner) {
      setShow(true)
      deleteGame()
    }
  }, [winner])

  const getRoom = async () => {
    try {
      const data = await request(`/api/rooms/search`, 'POST', { roomId });
      if (data.message === 'not have') {
        history.push(`/`)
      } else {
        let countX = 0, countO = 0;
        let stepsInBase = data.steps;
        stepsInBase = stepsInBase.split(',');

        for (let i = 0; i < stepsInBase.length; i++) {
          if (stepsInBase[i] === "") {
            stepsInBase[i] = null
          }
          if (stepsInBase[i] === "X") {
            countX++
          }
          if (stepsInBase[i] === "O") {
            countO++
          }
        }

        if (countX > countO) {
          setXisNext(false)
          socket.emit('ROOM:CHANGE_STEP_X', roomId);
        }

        if (countX !== 0 && countX === countO) {
          setStopZero(true)
        }
        setBoard(stepsInBase)
      }

    } catch (e) { }
  }

  useEffect(() => {
    socket.emit('ROOM:JOIN', roomId);
    getRoom()
  }, [])

  const sideHandler = (side) => {
    setSide(side)
  }
  const changeHandler = () => {
    setChange(true)
  }
  useEffect(() => {
    socket.on('ROOM:SET_SIDE', sideHandler);
    socket.on('ROOM:DISSCONECT', disconectHandler);
    socket.on('ROOM:SET_STEP', stepsHandler);
    socket.on('ROOM:STATE', stateHandler);
    socket.on('ROOM:CORRECT_STATE_X', changeHandler);
  }, []);
  const stateHandler = (state) => {
    setChange(false)
    setStopZero(false)
    setMove(state)
  }
  const stepsHandler = ({ board, xIsNext }) => {
    setXisNext(prev => xIsNext);
    setBlockStep(prev => false)
    setBoard(board)
  };

  const handleMain = () => {
    history.push(`/`)
  }

  const handleClick = async i => {
    // if (blockStep) return
    if (winner || board[i]) return;
    if (side === 'O' && board.indexOf('X') === -1 && board.indexOf('O') === -1) {
      return
    }
    if (change && side === 'X') {
      return
    }
    if (stopZero && side === 'O') {
      return
    }
    if (!move) {
      return
    }

    board[i] = side;
    setBoard(prev => board);
    setXisNext(prev => !xIsNext);
    setBlockStep(prev => true)
    socket.emit('ROOM:ADD', { roomId, board, xIsNext, side });
  }

  const deleteGame = async () => {
    await request(`/api/rooms/delete`, 'DELETE', { roomId });
  }

  const disconectHandler = (extraPerson) => {
    if (extraPerson) {
      setBlock(true)
    }
  }

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <>
      {block && 
      <div className='bisy'>
        <h1>The room is busy</h1>
        <Button 
        variant="secondary" 
        onClick={handleMain}>
              Back
        </Button>
      </div>}
      {!block &&
        <>
          <Board squares={board} onClick={handleClick} />
          <div style={styles}>
            <ListGroup>
              <ListGroup.Item>{'Next Player: ' + (xIsNext ? 'X' : 'O')}</ListGroup.Item>
              <ListGroup.Item>{`You: ${side}`}</ListGroup.Item>
            </ListGroup>
          </div>
        </>
      }
      <>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {'Winner: ' + winner}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleMain}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  )
}
