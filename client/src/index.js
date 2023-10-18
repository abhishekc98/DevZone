import axios from "axios"
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

require('dotenv').config({
    path: '../.env'
});
axios.defaults.baseURL = process.env.REACT_APP_BASE_API;

ReactDOM.render(<App />, document.getElementById('root'));

