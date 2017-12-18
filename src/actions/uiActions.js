import { UI_TOGGLE_SIDEBAR } from "./types";

export function toggleSideBar() {
    return function(dispatch) {
        dispatch({ type: UI_TOGGLE_SIDEBAR });
    };
}