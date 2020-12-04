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
  rates: [],
  compareRates: [],
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
    case SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };
    case TO_HIGHEST:
      return {
        ...state,
        rates: action.payload.rates,
        compareRates: action.payload.compareRates,
      };
    // case TO_HIGHEST:
    //   return {
    //     ...state,
    //     rates: [
    //       ...state.rates.sort((a, b) => {
    //         let firstRate = Number(a.Value.split(",").join("."));
    //         let secondRate = Number(b.Value.split(",").join("."));
    //         return firstRate - secondRate;
    //       }),
    //     ],
    //     compareRates: [
    //       ...(state.compareRates.length > 0
    //         ? state.compareRates.sort((a, b) => {
    //             let firstRate = Number(a.Value.split(",").join("."));
    //             let secondRate = Number(b.Value.split(",").join("."));
    //             return firstRate - secondRate;
    //           })
    //         : ""),
    //     ],
    //   };
    case TO_LOWEST:
      return {
        ...state,
        rates: action.payload.rates,
        compareRates: action.payload.compareRates,
      };
    // case TO_LOWEST:
    //   return {
    //     ...state,
    //     rates: [
    //       ...state.rates.sort((a, b) => {
    //         let firstRate = Number(a.Value.split(",").join("."));
    //         let secondRate = Number(b.Value.split(",").join("."));
    //         return secondRate - firstRate;
    //       }),
    //     ],
    //     compareRates: [
    //       ...(state.compareRates.length > 0
    //         ? state.compareRates.sort((a, b) => {
    //             let firstRate = Number(a.Value.split(",").join("."));
    //             let secondRate = Number(b.Value.split(",").join("."));
    //             return secondRate - firstRate;
    //           })
    //         : ""),
    //     ],
    //   };
    case ALPHABET_FILTER:
      return {
        ...state,
        rates: action.payload.rates,
        compareRates: action.payload.compareRates,
      };
    // case ALPHABET_FILTER:
    //   return {
    //     ...state,
    //     rates: [
    //       ...state.rates.sort((a, b) => {
    //         if (a.CharCode < b.CharCode) {
    //           return -1;
    //         }
    //         if (a.CharCode > b.CharCode) {
    //           return 1;
    //         }
    //         return 0;
    //       }),
    //     ],
    //     compareRates: [
    //       ...state.compareRates.sort((a, b) => {
    //         if (a.CharCode < b.CharCode) {
    //           return -1;
    //         }
    //         if (a.CharCode > b.CharCode) {
    //           return 1;
    //         }
    //         return 0;
    //       }),
    //     ],
    //   };
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
