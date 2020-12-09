import {
  START_LOADING,
  FINISH_LOADING,
  GET_RATES,
  SET_CURRENT_DATE,
  GET_COMPARE_RATES,
  SET_CURRENT_COMPARE_DATE,
  SET_FILTER,
  TO_HIGHEST,
  TO_LOWEST,
  CLEAN_FILTER,
  ALPHABET_FILTER,
  SET_DYNAMIC_VALUES,
  GET_CHARCODES,
} from "./actionTypes";

let initialState = {
  loading: false,
  reduxRates: [],
  reduxCompareRates: [],
  currentDate: "",
  currentCompareDate: "",
  filter: "",
  dynamicValues: [],
  charCodes: [],
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
        reduxRates: action.payload,
      };
    case SET_CURRENT_DATE:
      return {
        ...state,
        currentDate: action.payload,
      };
    case GET_COMPARE_RATES:
      return {
        ...state,
        reduxCompareRates: action.payload,
      };
    case SET_CURRENT_COMPARE_DATE:
      return {
        ...state,
        currentCompareDate: action.payload,
      };
    case SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };
    case TO_HIGHEST:
      return {
        ...state,
        reduxRates: [...action.payload.rates],
        reduxCompareRates: [...action.payload.compareRates],
      };
    case TO_LOWEST:
      return {
        ...state,
        reduxRates: [...action.payload.rates],
        reduxCompareRates: [...action.payload.compareRates],
      };
    case ALPHABET_FILTER:
      return {
        ...state,
        reduxRates: [...action.payload.rates],
        reduxCompareRates: [...action.payload.compareRates],
      };
    case CLEAN_FILTER:
      return {
        ...state,
        filter: "",
      };
    case SET_DYNAMIC_VALUES:
      return {
        ...state,
        dynamicValues: action.payload,
      };
    case GET_CHARCODES:
      return {
        ...state,
        charCodes: action.payload,
      };
    default:
      return state;
  }
}
