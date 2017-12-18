import { createPlaylist } from "../models/creators";
import { PLAYLIST_LOAD, PLAYLIST_LOAD_MANY, PLAYLIST_REMOVE, PLAYLIST_ADD_SONG } from "../actions/types";

const initialState = {};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case PLAYLIST_LOAD: {
            let playlist = createPlaylist(action.payload);
            return { ...state, [playlist.id]: playlist };
        }
        case PLAYLIST_LOAD_MANY: {
            let playlists = action.payload.reduce((obj, playlist) => {
                let play = createPlaylist(playlist);
                obj[play.id] = play;
                return obj;
            }, {});
            return { ...state, ...playlists };
        }
        case PLAYLIST_REMOVE: {
            let { [action.payload]: playlist, ...rest } = state;
            return rest;
        }
        case PLAYLIST_ADD_SONG: {
            let { id, song } = action.payload;
            return { ...state, [id]: { ...state[id], songs: [...state[id].songs, song] } };
        }
    }
    return state;
}