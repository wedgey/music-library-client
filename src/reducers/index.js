import { combineReducers } from "redux";

// Reducers
import ui from "./uiReducer";
import user from "./userReducer";
import library from "./libraryReducer";
import globalPlayer from "./globalPlayerReducer";
import player from "./playerReducer";
import playerManager from "./playerManagerReducer";
import playlists from "./playlistReducer";

export default combineReducers({
    ui,
    user,
    library,
    globalPlayer,
    player,
    playerManager,
    playlists
});