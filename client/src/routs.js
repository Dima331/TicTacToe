import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { GamePage } from './pages/GamePage'

export const useRouters = () => {
    return (
        <Switch>
            <Route path="/" exact>
                <GamePage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}