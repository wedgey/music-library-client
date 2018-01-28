import ajaxManager from "../utils/ajaxManager";
import { SERVER_URL } from "../config/main";
import { createChannel } from "../models/creators";

function buildChannelObjFromArray(channels = []) {
    return channels.reduce((obj, channel) => {
        obj[channel._id] = createChannel(channel);
        return obj;
    }, {});
}

// Create a channel
export function addChannel({ youtubeUsername }) {
    return new Promise((resolve, reject) => {
        ajaxManager.post(`${SERVER_URL}/channel/create`, { youtubeUsername })
                    .then(response => resolve(createChannel(response.data)))
                    .catch(error => reject(error));
    });
}

// Get channels
export function getChannels() {
    return new Promise((resolve, reject) => {
        ajaxManager.get(`${SERVER_URL}/channel`)
                    .then(response => resolve(buildChannelObjFromArray(response.data)))
                    .catch(error => reject(error));
    });
}

// Sync a channel
export function syncChannel({ id }) {
    return new Promise((resolve, reject) => {
        ajaxManager.post(`${SERVER_URL}/channel/sync`, { id })
                    .then(response => resolve())
                    .catch(error => reject(error));
    });
}