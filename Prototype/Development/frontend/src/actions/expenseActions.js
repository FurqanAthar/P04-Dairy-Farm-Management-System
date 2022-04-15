import axios from "axios";
import {
    FARM_EXPENSE_REQUEST,
    FARM_EXPENSE_SUCCESS,
    FARM_EXPENSE_FAIL,
} from "../constants/farmConstants"

export const getInvoiceData = () => async (dispatch, getState) => {
    try {
        dispatch({ type: FARM_EXPENSE_REQUEST });

        const {
            login: { loginInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: loginInfo.token,
            },
        };

        const { data } = await axios.get("/farm/expense/invoices", config);

        if (data.success) {
            console.log("Data:", data);
            dispatch({ type: FARM_EXPENSE_SUCCESS, payload: data.categoriesData });
        } else {
            dispatch({ type: FARM_EXPENSE_FAIL, payload: data.message });
        }
        console.log("HERE");
    } catch (error) {
        dispatch({
        type: FARM_EXPENSE_FAIL,
        payload:
            error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        });
    }
}