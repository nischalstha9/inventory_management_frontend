const isAuthenticatedReducer = (state = false, action) => {
  switch (action.type) {
    case "TRUE":
      return true;
    case "FALSE":
      return false;
    default:
      return state;
  }
};
export default isAuthenticatedReducer;
