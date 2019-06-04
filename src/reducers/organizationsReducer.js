import {
  FETCH_ORGANIZATIONS,
  NEW_ORGANIZATION,
  FILTER_ORGANIZATIONS
} from "../actions/types";

const initialState = {
  organizations: [],
  filteredOrganizations: [],
  organization: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_ORGANIZATIONS:
      return {
        ...state,
        organizations: action.payload
      };
    case FILTER_ORGANIZATIONS:
      return {
        ...state,
        filteredOrganizations: action.payload
      };
    case NEW_ORGANIZATION:
      return {
        ...state,
        organization: action.payload
      };
    default:
      return state;
  }
}
