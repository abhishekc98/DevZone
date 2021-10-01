import { SET_ALERT, REMOVE_ALERT } from '../actions/constants';

const initialState = [];

export const alertReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      //append alert
      return [...state, payload];
    case REMOVE_ALERT:
      //return all alerts except matching id
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
};
