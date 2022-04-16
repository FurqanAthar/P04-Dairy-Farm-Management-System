import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  userLoginReducer,
  userUpdateImageReducer,
  userUpdatePasswordReducer,
  userUpdateProfileReducer,
} from "./reducers/userReducer";
import farmReducer from "./reducers/farmReducer";
import customerReducer from "./reducers/customerReducer";


const reducer = combineReducers({
  login: userLoginReducer,
  updateUserName: userUpdateProfileReducer,
  updateUserPassword: userUpdatePasswordReducer,
  updateUserImage: userUpdateImageReducer,
  customer:customerReducer,
  farm: farmReducer,
});

const userInfoFromStorage = localStorage.getItem("loginInfo")
	? JSON.parse(localStorage.getItem("loginInfo"))
	: null;
const animalsFromStorage = localStorage.getItem("animals")
  ? JSON.parse(localStorage.getItem("animals"))
  : [];
const customersFromStorage = localStorage.getItem("customers")
  ? JSON.parse(localStorage.getItem("customers"))
  : [];
const initialState = {
  // cart: {
  //     cartItems: cartItemsFromStorage,
  //     shippingAddress: shippingAddressFromStorage,
  // },
  login: { loginInfo: { ...userInfoFromStorage } },
  farm: { animals: { animals: { ...animalsFromStorage } } },
  customer:{customers: {customers: {...customersFromStorage}}},
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
