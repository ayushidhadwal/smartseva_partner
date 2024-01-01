const initialState = {
  lang: "english",
  local: "en",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "english": {
      return { ...state, lang: action.lang, local: action.local };
    }
    case "arabic": {
      return { ...state, lang: action.lang, local: action.local };
    }
    default:
      return state;
  }
};
