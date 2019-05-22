import {
  FETCH_REQUESTS,
  NEW_REQUEST,
  PENDING_REQUESTS,
  FETCH_BUSINESS_AREAS
} from "../actions/types";

const initialState = {
  requests: [],
  request: {},
  pendingRequests: [],
  b_ares: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_REQUESTS:
      return {
        ...state,
        requests: action.payload
      };
    case NEW_REQUEST:
      return {
        ...state,
        request: action.payload
      };
    case PENDING_REQUESTS:
      return {
        ...state,
        pendingRequests: action.payload
      };
    case FETCH_BUSINESS_AREAS:
      return {
        ...state,
        b_areas: action.payload
      };
    default:
      return state;
  }
}
