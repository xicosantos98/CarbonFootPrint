import {
  FETCH_ORGANIZATIONS,
  NEW_ORGANIZATION,
  FILTER_ORGANIZATIONS,
  FETCH_MONTHLY_ACTIVITIES
} from "../actions/types";

const initialState = {
  organizations: [],
  filteredOrganizations: [],
  organization: {},
  m_activities: []
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
    default:
      return state;
  }
}
