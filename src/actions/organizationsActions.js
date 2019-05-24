import { FETCH_ORGANIZATIONS, NEW_ORGANIZATION } from "./types";
import axios from "axios";
import { BASE_URL } from "../config";

export const getOrganizations = () => dispatch => {
  axios
    .get(BASE_URL + "/organizations")
    .then(response => {
      dispatch({
        type: FETCH_ORGANIZATIONS,
        payload: response
      });
    })
    .catch(function(error) {
      console.log(error);
      return;
    });
};

export const createOrganization = (orgData, account) => dispatch => {
  return axios
    .post(BASE_URL + "/organizations", orgData, {
      headers: { "Content-Type": "application/json", address: account }
    })
    .then(response => {
      dispatch({
        type: NEW_ORGANIZATION,
        payload: response
      });
      return { valid: true, msg: response.data.message };
    })
    .catch(function(error) {
      return { valid: false, msg: error.response.data.message };
    });
};
