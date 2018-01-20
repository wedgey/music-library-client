import { combineReducers } from "redux";

// Reducers
import ui from "./uiReducer";
import user from "./userReducer";
import library from "./libraryReducer";
import players from "./playersReducer";
import playerManager from "./playerManagerReducer";
import playlists from "./playlistReducer";

export default combineReducers({
    ui,
    user,
    library,
    players,
    playerManager,
    playlists
});