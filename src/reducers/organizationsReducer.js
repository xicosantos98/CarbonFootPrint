import {
  FETCH_ORGANIZATIONS,
  NEW_ORGANIZATION,
  FILTER_ORGANIZATIONS,
  FETCH_MONTHLY_ACTIVITIES,
  FETCH_MONTHLY_FIX_COSTS,
  GET_ORGANIZATION,
  GET_PRODUCTS_ORGANIZATION,
  GET_EXTERNAL_PRODUCTS,
  CREATE_MONTHLY_ACTIVITY,
  CREATE_PRODUCT_QUANTITY,
  CREATE_PRODUCTION_COST,
  CREATE_MONTHLY_FIX_COST
} from "../actions/types";

const initialState = {
  organizations: [],
  filteredOrganizations: [],
  organization: {},
  m_activities: [],
  org_details: {},
  products_org: [],
  external_products: [],
  m_activity: {},
  prod_quantity: {},
  prod_cost: {},
  m_fix_costs: [],
  fix_cost: {}
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
    case FETCH_MONTHLY_FIX_COSTS:
      return {
        ...state,
        m_fix_costs: action.payload
      };
    case GET_ORGANIZATION:
      return {
        ...state,
        org_details: action.payload
      };
    case GET_PRODUCTS_ORGANIZATION:
      return {
        ...state,
        products_org: action.payload
      };
    case GET_EXTERNAL_PRODUCTS:
      return {
        ...state,
        external_products: action.payload
      };
    case CREATE_MONTHLY_ACTIVITY:
      return {
        ...state,
        m_activity: action.payload
      };

    case CREATE_PRODUCT_QUANTITY:
      return {
        ...state,
        prod_quantity: action.payload
      };
    case CREATE_PRODUCTION_COST:
      return {
        ...state,
        prod_cost: action.payload
      };
    case CREATE_MONTHLY_FIX_COST:
      return {
        ...state,
        fix_cost: action.payload
      };
    default:
      return state;
  }
}
