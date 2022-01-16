import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { userLoginReducer, userUpdateProfileReducer } from './reducers/userReducer'
import farmReducer from "./reducers/farmReducer";

const reducer = combineReducers({
  login: userLoginReducer,
  updateUserName: userUpdateProfileReducer,

  farm: farmReducer,
});

const userInfoFromStorage = localStorage.getItem("loginInfo")
  ? JSON.parse(localStorage.getItem("loginInfo"))
  : null;
const animalsFromStorage = localStorage.getItem("animals")
  ? JSON.parse(localStorage.getItem("animals"))
  : [];

const initialState = {
    // cart: {
    //     cartItems: cartItemsFromStorage,
    //     shippingAddress: shippingAddressFromStorage,
    // },
    login: { loginInfo: {...userInfoFromStorage} },
    farm: { animals: { animals: {...animalsFromStorage} } }
}

const middleware = [thunk]

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store
