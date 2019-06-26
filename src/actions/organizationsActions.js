import {
  FETCH_ORGANIZATIONS,
  NEW_ORGANIZATION,
  FILTER_ORGANIZATIONS,
  FETCH_MONTHLY_ACTIVITIES,
  GET_ORGANIZATION,
  GET_PRODUCTS_ORGANIZATION,
  GET_EXTERNAL_PRODUCTS
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
