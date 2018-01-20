"use strict"

import { PLAYER_MANAGER_LOAD_GLOBAL } from "../actions/types";

const initialState = {
    globalPlayerId: null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case PLAYER_MANAGER_LOAD_GLOBAL:
            return { ...state, globalPlayerId: action.payload };
    }
    return state;
}