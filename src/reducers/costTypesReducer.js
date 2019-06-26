import { GET_COST_TYPES } from "../actions/types";

const initialState = {
  costTypes: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_COST_TYPES:
      return {
        ...state,
        costTypes: action.payload
      };
    default:
      return state;
  }
}
