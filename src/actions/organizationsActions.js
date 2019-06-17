import {
  FETCH_ORGANIZATIONS,
  NEW_ORGANIZATION,
  FILTER_ORGANIZATIONS,
  FETCH_MONTHLY_ACTIVITIES
} from "./types";
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

export const getMonthlyActivities = id_organization => dispatch => {
  return axios
    .get(BASE_URL + "/m_activities/organization/" + id_organization)
    .then(response => {
      var new_array = response.data.map(act => ({
        Description: act.description,
        Product: act.output.name,
        Month: act.month,
        Year: act.id_year,
        CO2eq: act.CO2eq
      }));
      dispatch({
        type: FETCH_MONTHLY_ACTIVITIES,
        payload: new_array
      });
    });
};
