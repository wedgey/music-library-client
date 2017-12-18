import { UI_TOGGLE_SIDEBAR, UI_GLOBAL_PLAYER_LOAD } from "../actions/types";

const initialState = {
    isSideBarOpen: true,
    isGlobalPlayerLoaded: false
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case UI_TOGGLE_SIDEBAR: {
            return Object.assign({}, state, { isSideBarOpen: !state.isSideBarOpen });
        }
        case UI_GLOBAL_PLAYER_LOAD: {
            return { ...state, isGlobalPlayerLoaded: action.payload };
        }
    }
    return state;
}