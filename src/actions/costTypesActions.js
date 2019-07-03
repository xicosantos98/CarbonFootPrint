import { GET_COST_TYPES, CREATE_COST_TYPE } from "./types";

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

export const createCostType = (data, account) => dispatch => {
  return axios
    .post(BASE_URL + "/cost_type", data, {
      headers: { "Content-Type": "application/json", address: account }
    })
    .then(response => {
      dispatch({
        type: CREATE_COST_TYPE,
        payload: response
      });
      return { valid: true, msg: response.data.message };
    })
    .catch(function(error) {
      return { valid: false, msg: error.response.data.message };
    });
};
