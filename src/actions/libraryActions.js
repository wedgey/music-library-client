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

// Load Library Action
export function loadLibrary() {
    return function(dispatch) {
        ajaxManager.get(`${SERVER_URL}/song/`)
            .then(response => {
                let songs = response.data.data.reduce((obj, song) => {
                    obj[song._id] = createSong(song);
                    return obj;
                }, {});
                dispatch({ type: LIBRARY_LOAD, payload: songs });
            })
            .catch(error => {
                console.log(error.response);
            });
    }
}