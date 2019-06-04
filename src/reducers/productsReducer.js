import { FILTER_PRODUCTS } from "../actions/types";

const initialState = {
  filteredProducts: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FILTER_PRODUCTS:
      return {
        ...state,
        filteredProducts: action.payload
      };
    default:
      return state;
  }
}
