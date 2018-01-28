import ajaxManager from "../utils/ajaxManager";
import { SERVER_URL } from "../config/main";
import { createSong } from "../models/creators";

function buildSongObjFromArray(songs = []) {
    return songs.reduce((obj, song) => {
        obj[song._id] = createSong(song);
        return obj;
    }, {});
}

// Get Songs Action
export function getSongs({ title, page, pageSize, sortBy, sortOrder }) {
    return new Promise((resolve, reject) => {
        ajaxManager.get(`${SERVER_URL}/song`, { params: { title, page, pageSize }})
                    .then(response => resolve({songs: buildSongObjFromArray(response.data.data), totalCount: response.data.totalCount }))
                    .catch(error => reject(error));
    });
}

// Get Pending Songs Action
export function getPendingSongs({ title, page, pageSize, sortBy, sortOrder }) {
    return new Promise((resolve, reject) => {
        ajaxManager.get(`${SERVER_URL}/song/pending`, { params: { title, page, pageSize }})
                    .then(response => resolve({songs: buildSongObjFromArray(response.data.songs), totalCount: response.data.totalCount }))
                    .catch(error => reject(error));
    });
}

// Update Song Status
export function updateSongStatus(id, status) {
    return new Promise((resolve, reject) => {
        ajaxManager.post(`${SERVER_URL}/song/updatestatus`, { id, status })
                    .then(response => resolve())
                    .catch(error => reject(error));
    });
}

// Update Song Title
export function updateSongTitle(id, title) {
    return new Promise((resolve, reject) => {
        ajaxManager.post(`${SERVER_URL}/song/updatetitle`, { id, title })
                    .then(response => resolve())
                    .catch(error => reject(error));
    });
}

// Update Song Artists
export function updateSongArtistsByName(id, artistNames) {
    return new Promise((resolve, reject) => {
        ajaxManager.post(`${SERVER_URL}/song/updateartist`, { id, artistNames })
                    .then(response => resolve(createSong(response.data)))
                    .catch(error => reject(error));
    });
}