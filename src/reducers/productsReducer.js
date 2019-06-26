import { FILTER_PRODUCTS, GET_UNITS } from "../actions/types";

const initialState = {
  filteredProducts: [],
  units: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FILTER_PRODUCTS:
      return {
        ...state,
        filteredProducts: action.payload
      };
    case GET_UNITS:
      return {
        ...state,
        units: action.payload
      };
    default:
      return state;
  }
}
