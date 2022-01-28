import { combineReducers } from 'redux';
import usersReducer from './userReducer';
import errorsReducer from './errorReducer';


export default combineReducers({
  user: usersReducer,
  error: errorsReducer,
});