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

        const { data } = await axios.get("/farm/expense/getInvoices", config);

        if (data.success) {
            dispatch({ type: FARM_EXPENSE_SUCCESS, payload: data.invoices });
        } else {
            dispatch({ type: FARM_EXPENSE_FAIL, payload: data.message });
        }
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