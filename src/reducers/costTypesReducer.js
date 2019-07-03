import { GET_COST_TYPES, CREATE_COST_TYPE } from "../actions/types";

const initialState = {
  costTypes: [],
  cost: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_COST_TYPES:
      return {
        ...state,
        costTypes: action.payload
      };
    case CREATE_COST_TYPE:
      return {
        ...state,
        cost: action.payload
      };
    default:
      return state;
  }
}
