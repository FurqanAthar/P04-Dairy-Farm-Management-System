import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { userLoginReducer, userUpdateProfileReducer } from './reducers/userReducer'

const reducer = combineReducers({
    login: userLoginReducer,
    updateUserName: userUpdateProfileReducer
})

const userInfoFromStorage = localStorage.getItem("loginInfo")
  ? JSON.parse(localStorage.getItem("loginInfo"))
  : null;

const initialState = {
    // cart: {
    //     cartItems: cartItemsFromStorage,
    //     shippingAddress: shippingAddressFromStorage,
    // },
    login: { loginInfo: {...userInfoFromStorage} },
}

const middleware = [thunk]

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store
