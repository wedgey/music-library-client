import jwtDecode from "jwt-decode";

import ajaxManager from "../utils/ajaxManager";
import history from "../utils/history";
import cookies from "../utils/cookieManager";

import { AUTH_USER, AUTH_LOGOUT } from "./types";
import { SERVER_URL } from "../config/main";

// Login Action
export function loginUser({ email, password }) {
    return function(dispatch) {
        ajaxManager.post(`${SERVER_URL}/auth/login`, { email, password })
        .then(response => {
            cookies.set("token", response.data.token, { path: "/" });
            dispatch({ type: AUTH_USER, payload: response.data.user });
        })
        .catch(error => {
            console.log(error.response);
        });
    }
}

// Load From Token
export function loadUserFromToken({token}) {
    return function(dispatch) {
        let user = jwtDecode(token);
        dispatch({ type: AUTH_USER, payload: user });
    }
}

// Logout Action
export function logoutUser() {
    return function(dispatch) {
        dispatch({ type: AUTH_LOGOUT });
        cookies.remove("token", { path: "/" });
        history.push("/");
    }
}

// Register Action
export function registerUser({email, password}) {
    return function(dispatch) {
        ajaxManager.post(`${SERVER_URL}/auth/register`, { email, password })
        .then(response => {
            cookies.set("token", response.data.token, { path: "/" });
            dispatch({ type: AUTH_USER, payload: response.data.user });
            history.push("/");
        })
        .catch(error => {
            console.log(error.response);
        });
    }
}