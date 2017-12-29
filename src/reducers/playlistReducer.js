import { createPlaylist } from "../models/creators";
import { PLAYLIST_LOAD, PLAYLIST_LOAD_MANY, PLAYLIST_REMOVE, PLAYLIST_ADD_SONG, PLAYLIST_REMOVE_SONG, PLAYLIST_RENAME } from "../actions/types";

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
        case PLAYLIST_REMOVE_SONG: {
            let {id, song } = action.payload;
            return { ...state, [id]: { ...state[id], songs: state[id].songs.filter(s => s !== song) } };
        }
        case PLAYLIST_RENAME: {
            let { id, name } = action.payload;
            return { ...state, [id]: { ...state[id], name } };
        }
    }
    return state;
}