import {
  FILTER_PRODUCTS,
  GET_UNITS,
  GET_FINAL_PRODUCTS_FP,
  GET_TREE
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

export const getFootPrintsFinal = () => dispatch => {
  return axios
    .get(BASE_URL + "/products/final/footprints")
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
