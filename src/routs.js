import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { GamePage } from './pages/GamePage';

export const useRouters = () => {
    return (
        <Switch>
            <Route path="/" exact>
                <MainPage />
            </Route>
            <Route path="/:id">
                <GamePage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}