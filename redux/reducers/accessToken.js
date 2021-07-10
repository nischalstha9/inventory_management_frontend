const accessTokenReducer = (state = "", action) => {
  switch (action.type) {
    case "INSERT_TOKEN":
      return action.payload;
    case "REMOVE_TOKEN":
      return "";
    default:
      return state;
  }
};
export default accessTokenReducer;
