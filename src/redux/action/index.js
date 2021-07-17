export const log_in = () => {
  return {
    type: "AUTHENTICATED",
  };
};

export const log_out = () => {
  return {
    type: "NOT_AUTHENTICATED",
  };
};

export const insert_token = (token) => {
  return {
    type: "INSERT_TOKEN",
    payload: token,
  };
};

export const insert_user = (token) => {
  return {
    type: "INSERT_USER",
    payload: token,
  };
};

export const set_user_shop = (shop_dict) => {
  return {
    type: "SET_USER_SHOP",
    payload: shop_dict,
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

export const set_role = (role_number) => {
  return {
    type: "INSERT_ROLE",
    payload: role_number,
  };
};

export const remove_role = () => {
  return {
    type: "REMOVE_ROLE",
  };
};
