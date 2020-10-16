import React from 'react';
import Button from 'react-bootstrap/Button';

export const CloudTags = ({ tags, filterGames }) => (
    <>
    <h1>Tag cloud</h1>
    <ul className='cloud'>
        {tags && tags.map((item, i) => (
            <li className='cloud__item' key={i}>
                <Button
                    onClick={() => filterGames(item.name)}
                    type="button"
                    variant="success">
                    <p>{item.name}</p>
                </Button>
            </li>
        ))}
    </ul>
    </>
)
