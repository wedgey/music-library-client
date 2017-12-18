import ajaxManager from "../utils/ajaxManager";
import { SERVER_URL } from "../config/main";

// Gets artists by name
export function getArtists({name}, cb) {
    ajaxManager.get(`${SERVER_URL}/artist`, { params: { name } })
        .then(response => cb(response))
        .catch(error => console.log(error));
}