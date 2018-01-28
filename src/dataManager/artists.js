import ajaxManager from "../utils/ajaxManager";
import { SERVER_URL } from "../config/main";
import { createArtist } from "../models/creators";

// Gets artists by name
// export function getArtists({name}, cb) {
//     ajaxManager.get(`${SERVER_URL}/artist`, { params: { name } })
//         .then(response => cb(response))
//         .catch(error => console.log(error));
// }

export function getArtists({name}) {
    return new Promise((resolve, reject) => {
        ajaxManager.get(`${SERVER_URL}/artist`, { params: { name }})
                    .then(response => resolve(response.data.artists.map(artist => createArtist(artist))))
                    .catch(error => console.log(error));
    });
}