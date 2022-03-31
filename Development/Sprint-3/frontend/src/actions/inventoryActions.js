import axios from "axios";
import {
  FARM_INVENTORY_FAIL,
  FARM_INVENTORY_REQUEST,
  FARM_INVENTORY_SUCCESS,
} from "../constants/farmConstants";

export const getInventoryCategories = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FARM_INVENTORY_REQUEST });

    const {
      login: { loginInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: loginInfo.token,
      },
    };

    const { data } = await axios.get("/farm/inventory/category", config);

    if (data.success) {
      console.log("data", data);
      dispatch({ type: FARM_INVENTORY_SUCCESS, payload: data.categoriesData });
    } else {
      dispatch({ type: FARM_INVENTORY_FAIL, payload: data.message });
    }
  } catch (error) {
    dispatch({
      type: FARM_INVENTORY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
