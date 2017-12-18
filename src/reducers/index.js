import { combineReducers } from "redux";

// Reducers
import ui from "./uiReducer";
import user from "./userReducer";
import library from "./libraryReducer";
import globalPlayer from "./globalPlayerReducer";
import playlists from "./playlistReducer";

export default combineReducers({
    ui,
    user,
    library,
    globalPlayer,
    playlists
});