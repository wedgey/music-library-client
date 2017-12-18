import { createUser } from "../models/creators";
import { AUTH_USER, AUTH_LOGOUT } from "../actions/types";

const initialState = createUser();

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case AUTH_USER: {
            return Object.assign({}, state, createUser(action.payload));
        }
        case AUTH_LOGOUT: {
            return Object.assign({}, state, initialState);
        }
    }
    return state;
}