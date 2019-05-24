import { combineReducers } from "redux";
import userReducer from "./userReducer";
import requestsReducer from "./requestsReducer";
import organizationsReducer from "./organizationsReducer";

export default combineReducers({
  users: userReducer,
  requests: requestsReducer,
  organizations: organizationsReducer
});
