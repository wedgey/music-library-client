import ajaxManager from "../utils/ajaxManager";

import { LIBRARY_ADD,LIBRARY_LOAD } from "./types";
import { SERVER_URL } from "../config/main";

import { createSong } from "../models/creators";

// Add Song Action
export function addSong({ title, artist, youtubeId }) {
    return function(dispatch) {
        ajaxManager.post(`${SERVER_URL}/song/create`, { title, artist, youtubeId })
            .then(response => {
                dispatch({ type: LIBRARY_ADD, payload: createSong(response.data.data) });
            })
            .catch(error => {
                console.log(error.response);
            });
    }
}

// Load Songs
export function loadSongs(songs) {
    return function(dispatch) {
        dispatch({ type: LIBRARY_LOAD, payload: songs });
    }
}