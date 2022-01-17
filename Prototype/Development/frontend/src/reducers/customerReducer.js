import { combineReducers } from "redux";
import {
    CUSTOMER_ADD_REQUEST,
    CUSTOMER_ADD_FAIL,
    CUSTOMER_ADD_SUCCESS,
    CUSTOMER_ADD_CLEAR,
    CUSTOMERS_SUCCESS,
    CUSTOMERS_REQUEST,
    CUSTOMERS_FAIL,
    CUSTOMERS_CLEAR,
    CUSTOMER_UPDATE_CLEAR,
    CUSTOMER_UPDATE_FAIL,
    CUSTOMER_UPDATE_REQUEST,
    CUSTOMER_UPDATE_SUCCESS
} from "../constants/customerConstants";

const addCustomerReducer = (state = {}, action) => {
  switch (action.type) {
    case  CUSTOMER_ADD_REQUEST:
      return { loading: true };
    case  CUSTOMER_ADD_SUCCESS:
      return { loading: false, customers: action.payload, success: true };
    case CUSTOMER_ADD_FAIL:
      return { loading: false, error: action.payload, success: false };
    case CUSTOMER_ADD_CLEAR:
      return {};
    default:
      return state;
  }
};

const customers = (state = {}, action) => {
  switch (action.type) {
    case CUSTOMERS_REQUEST:
      return { loading: true };
    case CUSTOMERS_SUCCESS:
      return { loading: false, customers: action.payload, success: true };
    case CUSTOMERS_FAIL:
      return { loading: false, error: action.payload, success: false };
    default:
      return state;
  }
};

const updateCustomerReducer = (state = {}, action) => {
  switch (action.type) {
    case CUSTOMER_UPDATE_REQUEST:
      return { loading: true };
    case CUSTOMER_UPDATE_SUCCESS:
      return { loading: false, customers: action.payload, success: true };
    case CUSTOMER_UPDATE_FAIL:
      return { loading: false, error: action.payload, success: false };
    case CUSTOMER_UPDATE_CLEAR:
      return {};
    default:
      return state;
  }
};

const customerReducer = combineReducers({
    addCustomerReducer,
    customers,
    updateCustomerReducer,
  });
  
  export default customerReducer;

  