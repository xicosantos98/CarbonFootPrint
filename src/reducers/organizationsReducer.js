import {
  FETCH_ORGANIZATIONS,
  NEW_ORGANIZATION,
  FILTER_ORGANIZATIONS,
  FETCH_MONTHLY_ACTIVITIES,
  GET_ORGANIZATION
} from "../actions/types";

const initialState = {
  organizations: [],
  filteredOrganizations: [],
  organization: {},
  m_activities: [],
  org_details: {}
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
    case FETCH_MONTHLY_ACTIVITIES:
      return {
        ...state,
        m_activities: action.payload
      };
    case GET_ORGANIZATION:
      return {
        ...state,
        org_details: action.payload
      };
    default:
      return state;
  }
}
