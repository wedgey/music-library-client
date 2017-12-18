import ajaxManager from "../utils/ajaxManager";

import { PLAYLIST_LOAD, PLAYLIST_LOAD_MANY, PLAYLIST_REMOVE, PLAYLIST_ADD_SONG } from "./types";
import { SERVER_URL } from "../config/main";

// Create playlist
export function createPlaylist({ name, songs }) {
    return function(dispatch) {
        ajaxManager.post(`${SERVER_URL}/playlist/create`, { name, songs })
            .then(response => {
                dispatch({ type: PLAYLIST_LOAD, payload: response.data });
            })
            .catch(error => {
                console.log(error.response);
            });
    }
}

// Get playlists
export function getPlaylists() {
    return function(dispatch) {
        ajaxManager.get(`${SERVER_URL}/playlist`)
            .then(response => {
                dispatch({ type: PLAYLIST_LOAD_MANY, payload: response.data })
            })
            .catch(error => {
                console.log(error.response);
            });
    }
}

// Delete a playlist
export function deletePlaylist({id}) {
    return function(dispatch) {
        ajaxManager.delete(`${SERVER_URL}/playlist`, { params: { id }})
            .then(response => {
                dispatch({ type: PLAYLIST_REMOVE, payload: id });
            })
            .catch(error => {
                console.log(error);
            });
    }
}

// Add a song to a playlist
export function addSongToPlaylist({id, song}) {
    return function(dispatch) {
        ajaxManager.post(`${SERVER_URL}/playlist/addsong`, { id, songId: song.id })
            .then(response => {
                dispatch({ type: PLAYLIST_ADD_SONG, payload: {id, song }});
            })
            .catch(error => {
                console.log(error);
            });
    }
}