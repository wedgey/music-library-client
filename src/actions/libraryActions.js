import ajaxManager from "../utils/ajaxManager";

import { LIBRARY_ADD,LIBRARY_LOAD } from "./types";
import { SERVER_URL } from "../config/main";

// Add Song Action
export function addSong({ title, artist, youtubeId }) {
    return function(dispatch) {
        ajaxManager.post(`${SERVER_URL}/song/create`, { title, artist, youtubeId })
            .then(response => {
                dispatch({ type: LIBRARY_ADD, payload: response.data });
            })
            .catch(error => {
                console.log(error.response);
            });
    }
}

// Load Library Action
export function loadLibrary() {
    return function(dispatch) {
        ajaxManager.get(`${SERVER_URL}/song/`)
            .then(response => {
                dispatch({ type: LIBRARY_LOAD, payload: response.data });
            })
            .catch(error => {
                console.log(error.response);
            });
    }
}