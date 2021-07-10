export const log_in = () => {
  return {
    type: "TRUE",
  };
};

export const log_out = () => {
  return {
    type: "FALSE",
  };
};

export const insert_token = (token) => {
  return {
    type: "INSERT",
    payload: token,
  };
};

export const insert_user = (token) => {
  return {
    type: "INSERT_USER",
    payload: token,
  };
};
export const insert_alert = (token) => {
  return {
    type: "INSERT_ALERT",
    payload: token,
  };
};
export const remove_alert = (token) => {
  return {
    type: "REMOVE_ALERT",
    payload: token,
  };
};

export const insert_books = (books) => {
  return {
    type: "INSERT_BOOKS",
    payload: books,
  };
};

export const remove_books = () => {
  return {
    type: "REMOVE_BOOKS",
    payload: {},
  };
};
