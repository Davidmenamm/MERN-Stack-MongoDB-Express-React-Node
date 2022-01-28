import { FORM_SUBMIT_FAIL } from '../actions/errorActionTypes';

const initialState = {
  status: '',
  message: '',
}

export default function(state = initialState, action){
  switch(action.type){
    case FORM_SUBMIT_FAIL:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state;
  }
}