import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_UPDATENAME_REQUEST,
  USER_UPDATENAME_SUCCESS,
  USER_UPDATENAME_FAIL,
} from "../constants/userConstants";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(
      "/farm/login",
      { email, password },
      config
    );

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem("loginInfo", JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
                error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("loginInfo");
  dispatch({ type: USER_LOGOUT });
  document.location.href = "/login";
};

export const userUpdateName = (name) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATENAME_REQUEST });

    const {
      login: { loginInfo },
    } = getState();

    const config = { headers: { 
      "Content-Type": "application/json",
      Authorization: loginInfo.token
    }};

    const { data } = await axios.put(
      "/farm/update/user/name",
      { name },
      config
    );

    dispatch({ type: USER_UPDATENAME_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem("loginInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_UPDATENAME_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};