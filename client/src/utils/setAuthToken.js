import axios from 'axios';

//To send token for every request
const setAuthToken = (token) => {
  //IF TOKEN IF THERE IT'S GOING TO ADD IN HEADERS ELSE DELETE TOKEN
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
