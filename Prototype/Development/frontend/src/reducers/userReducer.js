import axios from 'axios'
import { 
    USER_LOGIN_REQUEST, 
    USER_LOGIN_SUCCESS, 
    USER_LOGIN_FAIL, 
    USER_LOGOUT,
    USER_UPDATENAME_SUCCESS,
    USER_UPDATENAME_REQUEST,
    USER_UPDATENAME_FAIL
} from '../constants/userConstants'

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, loginInfo: action.payload, success: true };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload, success: false };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATENAME_REQUEST:
      return { loading: true };
    case USER_UPDATENAME_SUCCESS:
      return { loading: false, loginInfo: action.payload, success: true };
    case USER_UPDATENAME_FAIL:
      return { loading: false, error: action.payload, success: false };
    default:
      return state;
  }
}