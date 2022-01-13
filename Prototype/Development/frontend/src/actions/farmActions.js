import axios from "axios";
import {
    FARM_ANIMAL_ADD_REQUEST,
    FARM_ANIMAL_ADD_SUCCESS,
    FARM_ANIMAL_ADD_CLEAR,
    FARM_ANIMAL_ADD_FAIL,
    FARM_ANIMALS_REQUEST,
    FARM_ANIMALS_SUCCESS,
    FARM_ANIMALS_FAIL
} from "../constants/farmConstants";

export const addAnimal = (animalData) => async (dispatch, getState) => {
  try {
    dispatch({ type: FARM_ANIMAL_ADD_REQUEST });

    const {
      login: { loginInfo },
    } = getState();
    
    const config = {
        headers: {
        "Content-Type": "application/json",
        Authorization: loginInfo.token,
        },
    };

    const { data } = await axios.post(
      "/farm/animals/add",
      { ...animalData },
      config
    );

    dispatch({ type: FARM_ANIMAL_ADD_SUCCESS, payload: data });

    await getAnimals()

    dispatch({ type: FARM_ANIMAL_ADD_CLEAR, payload: {} });

  } catch (error) {
    dispatch({
      type: FARM_ANIMAL_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getAnimals = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FARM_ANIMALS_REQUEST });

    const {
      login: { loginInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: loginInfo.token,
      },
    };

    const { data } = await axios.get(
      "/farm/animals/",
      config
    );

    dispatch({ type: FARM_ANIMALS_SUCCESS, payload: data });
    
    dispatch({ type: FARM_ANIMAL_ADD_CLEAR, payload: {} });

    localStorage.setItem("animals", JSON.stringify(data));


  } catch (error) {
    dispatch({
      type: FARM_ANIMALS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
}