import {
  FETCH_ORGANIZATIONS,
  NEW_ORGANIZATION,
  FILTER_ORGANIZATIONS,
  FETCH_MONTHLY_ACTIVITIES,
  FETCH_MONTHLY_FIX_COSTS,
  GET_ORGANIZATION,
  GET_PRODUCTS_ORGANIZATION,
  GET_EXTERNAL_PRODUCTS,
  CREATE_MONTHLY_ACTIVITY,
  CREATE_PRODUCT_QUANTITY,
  CREATE_PRODUCTION_COST,
  CREATE_MONTHLY_FIX_COST
} from "./types";
import axios from "axios";
import { BASE_URL } from "../config";
import moment from "moment";
moment.locale("pt");

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

export const getFilterOrganizations = orgName => dispatch => {
  return axios
    .get(BASE_URL + "/organizations?name=" + orgName)
    .then(response => {
      dispatch({
        type: FILTER_ORGANIZATIONS,
        payload: response
      });
      return true;
    })
    .catch(function(error) {
      return false;
    });
};

export const getOrganizationDetails = (idOrg, search) => dispatch => {
  return axios
    .get(BASE_URL + "/organizations/" + idOrg + "?search_product=" + search)
    .then(response => {
      dispatch({
        type: GET_ORGANIZATION,
        payload: response
      });
      return true;
    })
    .catch(function(error) {
      return false;
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

export const getMonthlyActivities = (
  id_organization,
  searchText,
  initialDate,
  finalDate
) => dispatch => {
  var url = BASE_URL + "/m_activities/organization/" + id_organization;

  return axios.get(url).then(response => {
    var new_array = [];

    if (response.data.length > 0) {
      if (searchText) {
        response.data.filter(act => {
          if (
            act.description.toLowerCase().match(searchText.toLowerCase()) ||
            act.output.name.toLowerCase().match(searchText.toLowerCase())
          ) {
            new_array.push({
              Description: act.description,
              Product: act.output.name,
              Month: act.month,
              Year: act.id_year,
              CO2eq: act.CO2eq
            });
          }
        });
      }

      if (initialDate && finalDate) {
        response.data.filter(act => {
          if (
            moment(act.month + " " + act.id_year, "MMMM YYYY").isBetween(
              initialDate,
              finalDate
            )
          ) {
            new_array.push({
              Description: act.description,
              Product: act.output.name,
              Month: act.month,
              Year: act.id_year,
              CO2eq: act.CO2eq
            });
          }
        });
      } else {
        new_array = response.data.map(act => ({
          Description: act.description,
          Product: act.output.name,
          Month: act.month,
          Year: act.id_year,
          CO2eq: act.CO2eq
        }));
      }
    }

    dispatch({
      type: FETCH_MONTHLY_ACTIVITIES,
      payload: new_array
    });
  });
};

export const getMonthlyCosts = (
  id_organization,
  searchText,
  initialDate,
  finalDate
) => dispatch => {
  var url = BASE_URL + "/m_costs/organization/" + id_organization;
  return axios.get(url).then(response => {
    var new_array = [];

    if (response.data.length > 0) {
      if (searchText) {
        response.data.filter(cost => {
          if (cost.description.toLowerCase().match(searchText.toLowerCase())) {
            new_array.push({
              Description: cost.description,
              Type: cost.cost_type,
              Month: cost.month,
              Year: cost.year,
              CO2eq: cost.CO2eq
            });
          }
        });
      }

      if (initialDate && finalDate) {
        response.data.filter(cost => {
          if (
            moment(cost.month + " " + cost.year, "MMMM YYYY").isBetween(
              initialDate,
              finalDate
            )
          ) {
            new_array.push({
              Description: cost.description,
              Type: cost.cost_type,
              Month: cost.month,
              Year: cost.year,
              CO2eq: cost.CO2eq
            });
          }
        });
      } else {
        new_array = response.data.map(cost => ({
          Description: cost.description,
          Type: cost.cost_type,
          Month: cost.month,
          Year: cost.year,
          CO2eq: cost.CO2eq
        }));
      }
    }

    dispatch({
      type: FETCH_MONTHLY_FIX_COSTS,
      payload: new_array
    });
  });
};

export const getProductsOrganization = (idOrg, search) => dispatch => {
  return axios
    .get(BASE_URL + "/products/organization/" + idOrg + "?search=" + search)
    .then(response => {
      dispatch({
        type: GET_PRODUCTS_ORGANIZATION,
        payload: response
      });
      return true;
    })
    .catch(function(error) {
      return false;
    });
};

export const getExternalProducts = (idOrg, search) => dispatch => {
  return axios
    .get(BASE_URL + "/products/external/" + idOrg + "?search=" + search)
    .then(response => {
      dispatch({
        type: GET_EXTERNAL_PRODUCTS,
        payload: response
      });
      return true;
    })
    .catch(function(error) {
      return false;
    });
};

export const createMactivity = (data, account) => dispatch => {
  return axios
    .post(BASE_URL + "/m_activities", data, {
      headers: { "Content-Type": "application/json", address: account }
    })
    .then(response => {
      dispatch({
        type: CREATE_MONTHLY_ACTIVITY,
        payload: response
      });
      return { valid: true, msg: response.data.message, id: response.data.id };
    })
    .catch(function(error) {
      return { valid: false, msg: error.response.data.message };
    });
};

export const createProdQuantity = (data, account) => dispatch => {
  return axios
    .post(BASE_URL + "/p_quantities", data, {
      headers: { "Content-Type": "application/json", address: account }
    })
    .then(response => {
      dispatch({
        type: CREATE_PRODUCT_QUANTITY,
        payload: response
      });
      return { valid: true, msg: response.data.message };
    })
    .catch(function(error) {
      return { valid: false, msg: error.response.data.message };
    });
};

export const createProdCost = (data, account) => dispatch => {
  return axios
    .post(BASE_URL + "/p_costs", data, {
      headers: { "Content-Type": "application/json", address: account }
    })
    .then(response => {
      dispatch({
        type: CREATE_PRODUCTION_COST,
        payload: response
      });
      return { valid: true, msg: response.data.message };
    })
    .catch(function(error) {
      return { valid: false, msg: error.response.data.message };
    });
};

export const createFixCost = (data, account) => dispatch => {
  return axios
    .post(BASE_URL + "/m_costs", data, {
      headers: { "Content-Type": "application/json", address: account }
    })
    .then(response => {
      dispatch({
        type: CREATE_MONTHLY_FIX_COST,
        payload: response
      });
      return { valid: true, msg: response.data.message };
    })
    .catch(function(error) {
      return { valid: false, msg: error.response.data.message };
    });
};
