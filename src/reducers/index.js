import { combineReducers } from "redux";
import userReducer from "./userReducer";
import requestsReducer from "./requestsReducer";
import organizationsReducer from "./organizationsReducer";
import productsReducer from "./productsReducer";
import costTypesReducer from "./costTypesReducer";

export default combineReducers({
  users: userReducer,
  requests: requestsReducer,
  organizations: organizationsReducer,
  products: productsReducer,
  cost_types: costTypesReducer
});
