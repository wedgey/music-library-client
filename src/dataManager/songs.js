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
export function getSongs({ title, page, pageSize }) {
    return new Promise((resolve, reject) => {
        ajaxManager.get(`${SERVER_URL}/song`, { params: { title, page, pageSize }})
                    .then(response => resolve({songs: buildSongObjFromArray(response.data.data), totalCount: response.data.totalCount }))
                    .catch(error => reject(error));
    });
}