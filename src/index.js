import React from 'react';
import 'typeface-roboto';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

Sentry.init({dsn: "https://4f8d6a27d14d488aa7a3792195680e18@sentry.io/1528422"});

ReactDOM.render(<App/>, document.getElementById('seargin-app'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();