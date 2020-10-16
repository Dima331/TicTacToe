import React from 'react';
import { NavLink } from 'react-router-dom';
import Card from 'react-bootstrap/Card';


export const ListGames = ({ games }) => (
    <div className="list">
        {games && games.map(game => (
            <Card key={game.room} style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title><p className='name-game'>Name:</p> <NavLink to={`/${game.room}`}><h1>{game.room}</h1></NavLink></Card.Title>
                        <p className='tags-game'>Tags: </p>
                    <div className='list__tag'>
                        {game.name.map((tag, i) => (
                            <Card.Subtitle key={i} className="mb-2 text-muted">{tag}</Card.Subtitle>
                        ))}
                    </div>
                </Card.Body>
            </Card>
        ))}
    </div >
)

