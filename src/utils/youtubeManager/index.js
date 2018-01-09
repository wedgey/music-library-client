import { notification } from "antd";

import { YOUTUBE_IFRAME_URL } from "../../config/main";
import { IdManager } from "../common";
import { YTPlayerState, YTPlayerRepeat } from "../enums";
import { PLAYER_LOAD, UI_GLOBAL_PLAYER_LOAD } from "../../actions/types";
import Store from "../../store";


import { YoutubePlayer } from "./playerModel";

class YoutubeManager {
    constructor(props) {
        this.idManager = new IdManager("YTPlayer");

        this.youtubeAPI = null;
        this.active = null;
        this.players = {};
        this.globalPlayerId = null;
        this.loadYoutubeScript();
    }

    loadYoutubeScript() {
        this.youtubeAPI = new Promise(resolve => {
            const tag = document.createElement('script');
            tag.src = YOUTUBE_IFRAME_URL;
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = () => { resolve(window.YT); }
        });
    }

    async createYoutubePlayer(element, options, isGlobal = false) {
        if (!element) return;
        let YT = await this.youtubeAPI;

        let id = this.idManager.generateId();
        let player = new YoutubePlayer(YT, id, element, options);
        player.player.addEventListener('onStateChange', this.handleStateChange.bind(this, id));
        this.players[id] = player;
        if (isGlobal) this.setAsGlobalPlayer(id);
        return id;
    }

    setAsGlobalPlayer(id) {
        this.globalPlayerId = id;
    }

    handleStateChange(id, e) {
        if (e.data === YTPlayerState.playing) {
            this.active = id;
            this.pauseAll(id);
        }
    }

    pauseAll(exclude = null) {
        for (var player in Store.getState().player) {
            if (player !== exclude) this.players[player].pauseVideo();
        }
    }

    getPlayer(id) {
        return this.players[id];
    }

    getGlobalPlayer() {
        return this.players[this.globalPlayerId];
    }

    destroyPlayer(id) {
        if (!this.players[id]) return false;
        this.players[id].destroy();
        delete this.players[id];
        if (this.globalPlayerId === id) this.globalPlayerId = null;
        return true;
    }
}

const youtubeManager = new YoutubeManager();
export default youtubeManager;