import { GET_ROLE_USER } from "./types";
import axios from "axios";
import { BASE_URL } from "../config";

export const getUser = account => dispatch => {
  axios
    .get(BASE_URL + "/users/" + account)
    .then(response => {
      dispatch({
        type: GET_ROLE_USER,
        payload: response
      });
    })
    .catch(function(error) {
      console.log(error);
      return;
    });
};
