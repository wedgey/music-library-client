import { createPlaylist } from "../models/creators";
import { GLOBAL_PLAYER_LOAD,
         GLOBAL_PLAYER_REPEAT,
         GLOBAL_PLAYER_CHANGE_CURRENT,
         GLOBAL_PLAYER_ADD_TO_PLAYLIST,
         GLOBAL_PLAYER_REMOVE_FROM_PLAYLIST,
         GLOBAL_PLAYER_LOAD_PLAYLIST, 
         GLOBAL_PLAYER_UPDATE_STATE} from "../actions/types";

import { YTPlayerRepeat, YTPlayerState } from "../utils/enums";

const initialState = {
    id: "",
    player: null,
    playlist: createPlaylist(),
    currentVideo: null,

    playerState: YTPlayerState.unstarted,
    // Player Options
    repeatStatus: YTPlayerRepeat.normal
};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case GLOBAL_PLAYER_LOAD:
            let player = action.payload;
            return { ...state, id: player.id, player: player.player, playlist: player.playlist, currentVideo: player.currentVideo, repeatStatus: player.playerOptions.repeatStatus };
        case GLOBAL_PLAYER_REPEAT:
            return { ...state, repeatStatus: action.payload };
        case GLOBAL_PLAYER_CHANGE_CURRENT:
            return { ...state, currentVideo: action.payload };
        // case GLOBAL_PLAYER_ADD_TO_PLAYLIST:
        //     return { ...state, playlist: [...state.playlist, action.payload] };
        // case GLOBAL_PLAYER_REMOVE_FROM_PLAYLIST:
        //     return { ...state, playlist: [ ...state.playlist.slice(0, action.payload), ...state.playlist.slice(action.payload + 1)]};
        case GLOBAL_PLAYER_LOAD_PLAYLIST:
            return { ...state, playlist: action.payload };
        case GLOBAL_PLAYER_UPDATE_STATE:
            return { ...state, playerState: action.payload }
    }
    return state;
}