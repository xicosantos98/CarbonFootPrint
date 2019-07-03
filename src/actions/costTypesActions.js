import { GET_COST_TYPES } from "./types";

import axios from "axios";
import { BASE_URL } from "../config";

export const getCostTypes = () => dispatch => {
  return axios
    .get(BASE_URL + "/cost_type")
    .then(response => {
      dispatch({
        type: GET_COST_TYPES,
        payload: response
      });
      return true;
    })
    .catch(function(error) {
      console.log(error);
      return false;
    });
};
