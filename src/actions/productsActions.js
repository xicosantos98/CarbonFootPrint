import {
  FILTER_PRODUCTS,
  GET_UNITS,
  GET_FINAL_PRODUCTS_FP,
  GET_TREE,
  CREATE_PRODUCT
} from "./types";
import axios from "axios";
import { BASE_URL } from "../config";

export const getFilterProducts = prodName => dispatch => {
  return axios
    .get(BASE_URL + "/products?name=" + prodName)
    .then(response => {
      dispatch({
        type: FILTER_PRODUCTS,
        payload: response
      });
      return true;
    })
    .catch(function(error) {
      return false;
    });
};

export const getUnits = () => dispatch => {
  return axios
    .get(BASE_URL + "/units/categories")
    .then(response => {
      dispatch({
        type: GET_UNITS,
        payload: response
      });
      return true;
    })
    .catch(function(error) {
      return false;
    });
};

export const getFootPrintsFinal = prodName => dispatch => {
  return axios
    .get(BASE_URL + "/products/final/footprints?search=" + prodName)
    .then(response => {
      dispatch({
        type: GET_FINAL_PRODUCTS_FP,
        payload: response
      });
      return true;
    })
    .catch(function(error) {
      return false;
    });
};

export const makeTree = idProd => dispatch => {
  return axios
    .get(BASE_URL + "/products/tree/" + idProd)
    .then(response => {
      dispatch({
        type: GET_TREE,
        payload: response
      });
      return true;
    })
    .catch(function(error) {
      return false;
    });
};

export const createProduct = (data, account) => dispatch => {
  return axios
    .post(BASE_URL + "/products", data, {
      headers: { "Content-Type": "application/json", address: account }
    })
    .then(response => {
      dispatch({
        type: CREATE_PRODUCT,
        payload: response
      });
      return { valid: true, msg: response.data.message };
    })
    .catch(function(error) {
      return { valid: false, msg: error.response.data.message };
    });
};
