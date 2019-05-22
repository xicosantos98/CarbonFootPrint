import { GET_ROLE_USER } from "../actions/types";

const initialState = {
  item: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ROLE_USER:
      return {
        ...state,
        item: action.payload
      };
    default:
      return state;
  }
}
