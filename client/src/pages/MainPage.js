import React, { useEffect } from 'react';
import { JoinRoom } from '../components/JoinRoom';
import { useHistory } from "react-router-dom";
import { useHttp } from '../hooks/http.hook';
import { ListGames } from '../components/ListGames'
import { CloudTags } from '../components/CloudTags'

export const MainPage = () => {
  const history = useHistory();
  const { request } = useHttp();
  const [games, setGames] = React.useState('');
  const [tags, setTags] = React.useState([]);
  const [gamesFilter, setGamesFilter] = React.useState('');

  const redirection = roomId => {
    history.push(`/${roomId}`);
  };

  const getGames = async () => {
    try {
      const data = await request('/api/rooms', 'GET', null);
      setGames(data);
      setGamesFilter(data);
    } catch (e) { }
  }

  const getTags = async () => {
    try {
      const data = await request('/api/tags', 'GET', null);
      setTags(data);
    } catch (e) { }
  }

  const filterGames = (name) => {
    let filter = [];

    gamesFilter.forEach(game => {
      game.name.forEach((tag) => {
        if (tag == name) {
          filter.push(game);
        }
      })
    });
    setGames(filter);
  }

  useEffect(() => {
    getGames();
    getTags();
  }, [])

  return (
    <>
      <JoinRoom
        redirection={redirection}
        tags={tags}
      />
      <CloudTags
        tags={tags}
        filterGames={filterGames}
      />
      <ListGames
        games={games}
      />
    </>
  )
}