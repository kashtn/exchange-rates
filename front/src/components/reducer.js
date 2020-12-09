export default function reducer(state, action) {
  switch (action.type) {
    case "setVisible":
      return {
        ...state,
        visible: action.payload,
      };
    case "setCompareFlag":
      return {
        ...state,
        compareFlag: action.payload,
      };
    case "setDynamicFlag":
      return {
        ...state,
        dynamicFlag: action.payload,
      };
    case "setCurrentCharCode":
      return {
        ...state,
        currentCharCode: action.payload,
      };
    case "setSelectedChar":
      return {
        ...state,
        selectedChar: action.payload,
      };
    case "setSelectedCompareChar":
      return {
        ...state,
        selectedCompareChar: action.payload,
      };
    case "setSearchFlag":
      return {
        ...state,
        searchFlag: action.payload,
      };
    default:
      return state;
  }
}
