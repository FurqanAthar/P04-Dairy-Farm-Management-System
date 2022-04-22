import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_UPDATENAME_REQUEST,
  USER_UPDATENAME_SUCCESS,
  USER_UPDATENAME_FAIL,
  USER_UPDATEPASSWORD_REQUEST,
  USER_UPDATEPASSWORD_SUCCESS,
  USER_UPDATEPASSWORD_FAIL,
  USER_UPDATEIMAGE_REQUEST,
  USER_UPDATEIMAGE_SUCCESS,
  USER_UPDATEIMAGE_FAIL,
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
  localStorage.removeItem("animals");
  dispatch({ type: USER_LOGOUT });
  document.location.href = "/login";
};

export const userUpdateName = (name) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATENAME_REQUEST });

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
      "/farm/user/update/name",
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

export const userUpdatePassword =
  ({ oldPassword, password }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: USER_UPDATEPASSWORD_REQUEST });

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
        "/farm/user/update/password",
        { oldPassword, password },
        config
      );

      if (data.success) {
        dispatch({ type: USER_UPDATEPASSWORD_SUCCESS, payload: data });
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      } else {
        dispatch({ type: USER_UPDATEPASSWORD_FAIL, payload: data.message });
      }

      localStorage.setItem("loginInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_UPDATEPASSWORD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const userUpdateImage = (image) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATEIMAGE_REQUEST });

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
      "/farm/user/update/image",
      { image },
      config
    );

    if (data.success) {
      dispatch({ type: USER_UPDATEIMAGE_SUCCESS, payload: data });
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      localStorage.setItem("loginInfo", JSON.stringify(data));
    } else {
      dispatch({ type: USER_UPDATEIMAGE_FAIL, payload: data.message });
    }
  } catch (error) {
    dispatch({
      type: USER_UPDATEIMAGE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
