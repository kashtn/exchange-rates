import {
  START_LOADING,
  FINISH_LOADING,
  GET_RATES,
  SET_CURRENT_DATE,
  GET_COMPARE_RATES,
  SET_CURRENT_COMPARE_DATE,
} from "./actionTypes";

let initialState = {
  loading: false,
  rates: [],
  compareRates: [],
  currentDate: "",
  currentCompareDate: "",
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        loading: true,
      };
    case FINISH_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case GET_RATES:
      return {
        ...state,
        rates: action.payload,
      };
    case SET_CURRENT_DATE:
      return {
        ...state,
        currentDate: action.payload,
      };
    case GET_COMPARE_RATES:
      return {
        ...state,
        compareRates: action.payload,
      };
    case SET_CURRENT_COMPARE_DATE:
      return {
        ...state,
        currentCompareDate: action.payload,
      };
    default:
      return state;
  }
}
