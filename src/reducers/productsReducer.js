import {
  FILTER_PRODUCTS,
  GET_UNITS,
  GET_FINAL_PRODUCTS_FP,
  GET_TREE,
  CREATE_PRODUCT
} from "../actions/types";

const initialState = {
  filteredProducts: [],
  units: [],
  fp_prod: [],
  tree: {},
  product: {}
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
    case GET_FINAL_PRODUCTS_FP:
      return {
        ...state,
        fp_prod: action.payload
      };
    case GET_TREE:
      return {
        ...state,
        tree: action.payload
      };
    case CREATE_PRODUCT:
      return {
        ...state,
        product: action.payload
      };
    default:
      return state;
  }
}
