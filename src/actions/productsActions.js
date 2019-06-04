import { FILTER_PRODUCTS } from "./types";
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
