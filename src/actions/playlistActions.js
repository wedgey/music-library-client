import ajaxManager from "../utils/ajaxManager";

import { PLAYLIST_LOAD, PLAYLIST_LOAD_MANY, PLAYLIST_REMOVE, PLAYLIST_ADD_SONG, LIBRARY_LOAD } from "./types";
import { SERVER_URL } from "../config/main";
import { createSong } from "../models/creators";

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
                let songs = response.data.reduce((obj, playlist) => {
                    let playlistSongs = playlist.songs.reduce((sObj, s) => { sObj[s._id] = createSong(s); return sObj; }, {});
                    return { ...obj, ...playlistSongs}
                }, {});
                dispatch({ type: LIBRARY_LOAD, payload: songs });
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
                dispatch({ type: PLAYLIST_ADD_SONG, payload: {id, song: song.id }});
            })
            .catch(error => {
                console.log(error);
            });
    }
}