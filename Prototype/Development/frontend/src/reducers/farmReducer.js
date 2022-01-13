import { combineReducers } from "redux";
import {
  FARM_ANIMAL_ADD_REQUEST,
  FARM_ANIMAL_ADD_SUCCESS,
  FARM_ANIMAL_ADD_CLEAR,
  FARM_ANIMAL_ADD_FAIL,
  FARM_ANIMALS_REQUEST,
  FARM_ANIMALS_SUCCESS,
  FARM_ANIMALS_FAIL,
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
}

const farmReducer = combineReducers({
  addAnimalReducer,
  animals
});

export default farmReducer;