import { FETCH_ORGANIZATIONS, NEW_ORGANIZATION } from "../actions/types";

const initialState = {
  organizations: [],
  organization: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_ORGANIZATIONS:
      return {
        ...state,
        organizations: action.payload
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
