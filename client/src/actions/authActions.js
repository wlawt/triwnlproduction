import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

// Register user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/admin/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login user
export const loginUser = userData => dispatch => {
  axios
    .post("/api/admin/login", userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to localStorage
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set admin
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log out
export const logoutUser = () => dispatch => {
  // Remove from local storage
  localStorage.removeItem("jwtToken");
  // Remove from auth header
  setAuthToken(false);
  // Set admin to empty obj
  dispatch(setCurrentUser({}));
};
