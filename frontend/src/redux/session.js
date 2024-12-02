import { del, get, post } from "./csrf.js";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
  return {
    type: SET_USER,
    user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

export const restoreUser = () => async (dispatch) => {
  const data = await get("/api/session");
  console.log(data);
  dispatch(setUser(data.user));
  return data;
};

export const signup = (user) => async (dispatch) => {
  const data = await post("/api/signup", user);
  console.log(data);
  dispatch(setUser(data.user));
  return data;
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const data = await post("/api/login", {
    credential,
    password,
  });
  document.dispatchEvent(new CustomEvent("login"));
  dispatch(setUser(data.user));
  return data;
};

export const logout = () => async (dispatch) => {
  const response = await del("/api/logout");
  document.dispatchEvent(new CustomEvent("logout"));
  dispatch(removeUser());
  return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.user };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default sessionReducer;
