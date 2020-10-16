import React, {useState} from 'react';
import { useHttp } from '../hooks/http.hook';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import { Tags } from './Tags';

export const JoinRoom = ({ redirection, tags }) => {
  const { request } = useHttp();
  const [roomId, setRoomId] = useState('');
  const [AllTags, setAllTags] = useState([]);
  const [error, setError] = useState('');
  const [errorTags, setErrorTags] = useState(false);

  const newTags = (newTags) => {
    setAllTags(newTags);
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    if (AllTags.length === 0) {
      setErrorTags(true);
      return;
    } else {
      setErrorTags(false);
    }

    if (!roomId) { return null; }
    const data = await request('/api/rooms/add', 'POST', { roomId, tags: AllTags });
    if (data.message === 'add') {
      redirection(roomId);
    } else {
      setError('There is such a game');
    }
  }

  return (
    <Row className='justify-content-md-center'>
      <Col xs lg='6' className=' mt-5'>
        <Card>
          <Card.Body>
            <h1>New game</h1>
            <Form
              onSubmit={submitHandler}
            >
              <Form.Group controlId='formBasicLogin'>
                <Form.Label>Id room</Form.Label>
                <Form.Control
                  required
                  type='text'
                  name='room'
                  placeholder='Id room'
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
              </Form.Group>
              {error && <Alert variant='danger'>{error}</Alert>}
              <Form.Label>Tags</Form.Label>
              <Tags
                tagsInBase={tags}
                newTags={newTags}
              />
              {errorTags && <Alert variant='danger'>Enter tag</Alert>}
              <Button
                variant='primary'
                type='submit'
                >
                Start</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}