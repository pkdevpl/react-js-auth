import React from 'react';

import PageLogin from './PageLogin';
import PageRegister from './PageRegister';
import PageReset from './PageReset';
import PageUser from './PageUser';

import PrivateRoute from './routes/PrivateRoute';
import GuestRoute from './routes/GuestRoute';
import UrlActionRouter from './UrlActionRouter';

import {Switch} from 'react-router-dom';
import '../style.css';

export default function App() {
    return (
        <>
            <Switch>
                <PrivateRoute path="/" exact component={PageUser} redirect="/zaloguj" />
                <GuestRoute path="/zaloguj" component={PageLogin} redirect="/" />
                <GuestRoute path="/utworz-konto" component={PageRegister} redirect="/" />
                <GuestRoute path="/zresetuj-haslo" component={PageReset} redirect="/" />
                <UrlActionRouter />
            </Switch>
        </>
    );
};