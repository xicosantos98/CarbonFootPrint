import {
  FETCH_REQUESTS,
  NEW_REQUEST,
  PENDING_REQUESTS,
  FETCH_BUSINESS_AREAS
} from "./types";
import axios from "axios";
import { BASE_URL } from "../config";

export const getRequests = () => dispatch => {
  axios
    .get(BASE_URL + "/requests")
    .then(response => {
      dispatch({
        type: FETCH_REQUESTS,
        payload: response
      });
    })
    .catch(function(error) {
      console.log(error);
      return;
    });
};

export const createRequest = (reqData, account) => dispatch => {
  return axios
    .post(BASE_URL + "/requests", reqData, {
      headers: { "Content-Type": "application/json", address: account }
    })
    .then(response => {
      dispatch({
        type: NEW_REQUEST,
        payload: response
      });
      return { valid: true, msg: response.data.message };
    })
    .catch(function(error) {
      return { valid: false, msg: error.response.data.message };
    });
};

export const getPendingRequests = () => dispatch => {
  axios
    .get(BASE_URL + "/requests/pending")
    .then(response => {
      dispatch({
        type: PENDING_REQUESTS,
        payload: response
      });
    })
    .catch(function(error) {
      console.log(error);
      return;
    });
};

export const getBAreas = () => dispatch => {
  return axios
    .get(BASE_URL + "/requests/b_areas")
    .then(response => {
      dispatch({
        type: FETCH_BUSINESS_AREAS,
        payload: response.data
      });
      return true;
    })
    .catch(function(error) {
      console.log(error);
      return false;
    });
};
