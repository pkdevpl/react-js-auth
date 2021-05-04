import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import {BrowserRouter} from 'react-router-dom';
import LoadingProvider from './contexts/LoadingContext';
import AuthProvider from './contexts/AuthContext';

ReactDOM.render(
    <BrowserRouter>
        <LoadingProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </LoadingProvider>
    </BrowserRouter>,
    document.getElementById('root')
);