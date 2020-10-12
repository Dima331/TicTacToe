import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

export const useRouters = () => {
        return (
            <Switch>
                <Route path="/" exact>
                </Route>
                <Redirect to="/" />
            </Switch>
        )
}