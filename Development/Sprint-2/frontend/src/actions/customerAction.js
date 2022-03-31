import axios from "axios";
import {
  CUSTOMER_ADD_REQUEST,
  CUSTOMER_ADD_SUCCESS,
  CUSTOMER_ADD_CLEAR,
  CUSTOMER_ADD_FAIL,
  CUSTOMERS_CLEAR,
  CUSTOMERS_FAIL,
  CUSTOMERS_REQUEST,
  CUSTOMERS_SUCCESS,
  CUSTOMER_UPDATE_SUCCESS,
  CUSTOMER_UPDATE_REQUEST,
  CUSTOMER_UPDATE_FAIL,
  CUSTOMER_UPDATE_CLEAR
//   FARM_ANIMALS_REQUEST,
//   FARM_ANIMALS_SUCCESS,
//   FARM_ANIMALS_FAIL,
//   FARM_MEMBERS_REQUEST,
//   FARM_MEMBERS_SUCCESS,
//   FARM_MEMBERS_FAIL,
//   FARM_ANIMAL_UPDATE_REQUEST,
//   FARM_ANIMAL_UPDATE_SUCCESS,
//   FARM_ANIMAL_UPDATE_CLEAR,
//   FARM_ANIMAL_UPDATE_FAIL,
} from "../constants/customerConstants";

export const addCustomer = (customerData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CUSTOMER_ADD_REQUEST });

    const {
      login: { loginInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: loginInfo.token,
      },
    };
    console.log("fronend",config.headers.Authorization)
    const { data } = await axios.post(
      "/customer/add",
      { ...customerData },
      config
    );

    dispatch({ type: CUSTOMER_ADD_SUCCESS, payload: data });


    dispatch({ type: CUSTOMER_ADD_CLEAR, payload: {} });
  } catch (error) {
    dispatch({
      type: CUSTOMER_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const getCustomers = () => async (dispatch, getState) => {
  try {
    dispatch({ type:  CUSTOMERS_REQUEST });

    const {
      login: { loginInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: loginInfo.token,
      },
    };

    const { data } = await axios.get("/customer", config);

    dispatch({ type: CUSTOMERS_SUCCESS, payload: data });

    dispatch({ type: CUSTOMERS_CLEAR, payload: {} });

    localStorage.setItem("customers", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: CUSTOMERS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};



export const updateCustomer = (customerData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CUSTOMER_UPDATE_REQUEST });

    const {
      login: { loginInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: loginInfo.token,
      },
    };

    const { data } = await axios.put(
      "/customer/update",
      { ...customerData },
      config
    );

    dispatch({ type: CUSTOMER_UPDATE_SUCCESS, payload: data });

    await getCustomers();

    dispatch({ type: CUSTOMER_UPDATE_CLEAR, payload: {} });
  } catch (error) {
    dispatch({
      type: CUSTOMER_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
