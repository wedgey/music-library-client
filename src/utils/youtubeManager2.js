import { notification } from "antd";

import { YOUTUBE_IFRAME_URL } from "../config/main";
import { IdManager } from "./common";
import { YTPlayerState, YTPlayerRepeat } from "./enums";
import { GLOBAL_PLAYER_LOAD, UI_GLOBAL_PLAYER_LOAD } from "../actions/types";
import Store from "../store";

class YoutubePlayer {
    constructor(YT, id, element, options = {}) {
        const defaultPlayerOptions = {
            height: '100%',
            width: '100%',
            playerVars: {
                controls: 0,
                showinfo: 0,
                modestbranding: 1,
                fs: 0,
                iv_load_policy: 3,
            },
        }
        this.player = new YT.Player(element, { ...defaultPlayerOptions, ...options });
        this.player.addEventListener('onReady', this.onReady);
        this.player.addEventListener('onStateChange', this.onStateChange.bind(this));
        
        this.id = id;
        this.playlist = [];
        this.currentVideo = null;
        this.playerOptions = {
            repeatStatus: 0
        }
    }

    // Methods
    getDuration() {
        return this.player.getDuration();
    }

    getPlayerState() {
        return this.player.getPlayerState();
    }

    getCurrentTime() {
        return this.player.getCurrentTime();
    }

    getCurrentSong() {
        return this.playlist[this.currentVideo];
    }

    // Controls
    playPrevious() {
        if (this.playlist.length === 0 || this.currentVideo === null) return;
        else if (this.currentVideo > 0 && this.getCurrentTime() <= 5) {
            this.currentVideo--;
            return this.loadVideoBySong(this.playlist[this.currentVideo])
        }
        else return this.seekTo(0);
    }

    playNext() {
        if (this.playlist.length === 0 || this.currentVideo === null) return;
        else if (this.currentVideo < this.playlist.length - 1) {
            this.currentVideo++;
            return this.loadVideoBySong(this.playlist[this.currentVideo]);
        }
        else if (this.currentVideo === this.playlist.length - 1 && this.playerOptions.repeatStatus === YTPlayerRepeat.repeatPlaylist) {
            this.currentVideo = 0;
            return this.loadVideoBySong(this.playlist[this.currentVideo]);
        }
        else if (this.playerOptions.repeatStatus === YTPlayerRepeat.repeatOne) return this.seekTo(0);
        else return this.seekTo(this.getDuration());
    }

    playVideo() {
        this.player.playVideo();
    }

    pauseVideo() {
        this.player.pauseVideo();
    }

    togglePlay() {
        this.getPlayerState() === YTPlayerState.playing ? this.pauseVideo() : this.playVideo();
    }

    toggleRepeat() {
        switch (this.playerOptions.repeatStatus) {
            case YTPlayerRepeat.normal:
                this.playerOptions.repeatStatus = YTPlayerRepeat.repeatOne;
                break;
            case YTPlayerRepeat.repeatOne:
                this.playerOptions.repeatStatus = YTPlayerRepeat.repeatPlaylist;
                break;
            case YTPlayerRepeat.repeatPlaylist:
                this.playerOptions.repeatStatus = YTPlayerRepeat.normal;
                break;
        }
        this.dispatchOptionsEvent();
    }

    seekTo(seconds, allowSeekAhead = true) {
        this.player.seekTo(seconds, allowSeekAhead);
    }

    loadVideoBySong(song) {
        if (!song) return;
        this.loadVideoById(song.youtubeId);
    }

    loadNewSong(song) {
        if (!song) return;
        this.playlist = [song];
        this.currentVideo = 0;
        this.loadVideoById(song.youtubeId);
    }

    loadVideoById(id) {
        this.player.loadVideoById(id);
    }

    queueVideoBySong(song) {
        if (!song) return;
        this.playlist.push(song);
        if (this.currentVideo === null) {
            this.currentVideo = 0;
            this.loadVideoBySong(this.playlist[this.currentVideo]);
        }
    }

    destroy() {
        this.player.destroy();
    }

    // Event Handlers
    onReady(e) {
        console.log(e);
    }

    onStateChange(e) {
        let { repeatStatus } = this.playerOptions;
        let playlistMaxIndex = this.playlist.length - 1;
        if (playlistMaxIndex === 0 && repeatStatus === YTPlayerRepeat.repeatPlaylist) repeatStatus = YTPlayerRepeat.repeatOne;
        switch(e.data) {
            case YTPlayerState.ended:
                if (this.currentVideo === null || playlistMaxIndex < 0) return;
                if (repeatStatus === YTPlayerRepeat.repeatOne) this.seekTo(0);
                else if (this.currentVideo < playlistMaxIndex) {
                    this.currentVideo++;
                    this.loadVideoBySong(this.playlist[this.currentVideo]);
                }
                else if (this.currentVideo === playlistMaxIndex) {
                    if (repeatStatus === YTPlayerRepeat.repeatPlaylist) {
                        this.currentVideo = 0;
                        this.loadVideoBySong(this.playlist[this.currentVideo]);
                    }
                }
        }
    }

    // Custom Events
    dispatchOptionsEvent() {
        let event = new CustomEvent('YTPlayerOptionsChange', { detail: this.playerOptions, bubbles: true, cancelable: false });
        this.player.getIframe().dispatchEvent(event);
    }

}

class YoutubeManager {
    constructor(props) {
        this.idManager = new IdManager("YTPlayer");

        this.youtubeAPI = null;
        this.players = {};
        this.active = null;
        this.defaultPlayerOptions = {
            height: '100%',
            width: '100%',
            videoId: 'V2hlQkVJZhE',
            playerVars: {
                controls: 0,
                showinfo: 0,
                modestbranding: 1,
                fs: 0,
                iv_load_policy: 3,
                loop: 1,
                playlist: 'V2hlQkVJZhE'
            },
        }
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
        Store.dispatch({ type: UI_GLOBAL_PLAYER_LOAD, payload: true });
    }

    handleStateChange(id, e) {
        if (e.data === YTPlayerState.playing) {
            this.active = id;
            this.pauseAll(id);
        }
    }

    pauseAll(exclude = null) {
        for (var player in this.players) {
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