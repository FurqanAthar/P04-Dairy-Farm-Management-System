import { combineReducers } from "redux";
import {
  FARM_ANIMAL_ADD_REQUEST,
  FARM_ANIMAL_ADD_SUCCESS,
  FARM_ANIMAL_ADD_CLEAR,
  FARM_ANIMAL_ADD_FAIL,
  FARM_ANIMALS_REQUEST,
  FARM_ANIMALS_SUCCESS,
  FARM_ANIMALS_FAIL,
  FARM_MEMBERS_REQUEST,
  FARM_MEMBERS_SUCCESS,
  FARM_MEMBERS_FAIL,
  FARM_WORKERS_REQUEST,
  FARM_WORKERS_SUCCESS,
  FARM_WORKERS_FAIL,
  FARM_ANIMAL_UPDATE_REQUEST,
  FARM_ANIMAL_UPDATE_SUCCESS,
  FARM_ANIMAL_UPDATE_FAIL,
  FARM_ANIMAL_UPDATE_CLEAR,
  FARM_INVENTORY_REQUEST,
  FARM_INVENTORY_SUCCESS,
  FARM_INVENTORY_FAIL,
  FARM_EXPENSE_REQUEST,
  FARM_EXPENSE_SUCCESS,
  FARM_EXPENSE_FAIL,
} from "../constants/farmConstants";

const addAnimalReducer = (state = {}, action) => {
  switch (action.type) {
    case FARM_ANIMAL_ADD_REQUEST:
      return { loading: true };
    case FARM_ANIMAL_ADD_SUCCESS:
      return { loading: false, animals: action.payload, success: true };
    case FARM_ANIMAL_ADD_FAIL:
      return { loading: false, error: action.payload, success: false };
    case FARM_ANIMAL_ADD_CLEAR:
      return {};
    default:
      return state;
  }
};

const updateAnimalReducer = (state = {}, action) => {
  switch (action.type) {
    case FARM_ANIMAL_UPDATE_REQUEST:
      return { loading: true };
    case FARM_ANIMAL_UPDATE_SUCCESS:
      return { loading: false, animals: action.payload, success: true };
    case FARM_ANIMAL_UPDATE_FAIL:
      return { loading: false, error: action.payload, success: false };
    case FARM_ANIMAL_UPDATE_CLEAR:
      return {};
    default:
      return state;
  }
};

const animals = (state = {}, action) => {
  switch (action.type) {
    case FARM_ANIMALS_REQUEST:
      return { loading: true };
    case FARM_ANIMALS_SUCCESS:
      return { loading: false, animals: action.payload, success: true };
    case FARM_ANIMALS_FAIL:
      return { loading: false, error: action.payload, success: false };
    default:
      return state;
  }
};

const teamMembers = (state = {}, action) => {
  switch (action.type) {
    case FARM_MEMBERS_REQUEST:
      return { loading: true };
    case FARM_MEMBERS_SUCCESS:
      return { loading: false, members: action.payload, success: true };
    case FARM_MEMBERS_FAIL:
      return { loading: false, error: "Unknown Error Occured", success: false };
    default:
      return state;
  }
};

const workers = (state = {}, action) => {
  switch (action.type) {
    case FARM_WORKERS_REQUEST:
      return { loading: true };
    case FARM_WORKERS_SUCCESS:
      return { loading: false, workers: action.payload, success: true };
    case FARM_WORKERS_FAIL:
      return { loading: false, error: "Unknown Error Occured", success: false };
    default:
      return state;
  }
};

const inventory = (state = { loading: true }, action) => {
  switch (action.type) {
    case FARM_INVENTORY_REQUEST:
      return { loading: true };
    case FARM_INVENTORY_SUCCESS:
      return { loading: false, inventory: action.payload, success: true };
    case FARM_INVENTORY_FAIL:
      return { loading: false, error: action.payload, success: false };
    default:
      return state;
  }
};

const expense = (state = {}, action) => {
	switch (action.type) {
		case FARM_EXPENSE_REQUEST:
			return { loading: true };
		case FARM_EXPENSE_SUCCESS:
			return { loading: false, invoices: action.payload, success: true };
		case FARM_EXPENSE_FAIL:
			return { loading: false, error: "Unknown Error Occured", success: false };
		default:
			return state;
	}
};

const farmReducer = combineReducers({
  addAnimalReducer,
  updateAnimalReducer,
  animals,
  teamMembers,
  workers,
  inventory,
  expense,
});

export default farmReducer;
