"use strict"

import { YTPlayerState, YTPlayerRepeat } from "../enums";
import Store from "../../store";
import { GLOBAL_PLAYER_LOAD,
         GLOBAL_PLAYER_REPEAT,
         GLOBAL_PLAYER_CHANGE_CURRENT,
         GLOBAL_PLAYER_ADD_TO_PLAYLIST,
         GLOBAL_PLAYER_REMOVE_FROM_PLAYLIST,
         GLOBAL_PLAYER_LOAD_PLAYLIST, 
         GLOBAL_PLAYER_UPDATE_STATE} from "../../actions/types";

import { createPlaylist } from "../../models/creators";

export class YoutubePlayer {
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
        this.playlist = createPlaylist();
        this.currentVideo = null;
        this.playerOptions = {
            repeatStatus: YTPlayerRepeat.repeatPlaylist
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
        return Store.getState().library[this.playlist.songs[this.currentVideo]];
    }

    getCurrentPlaylist() {
        return this.playlist;
    }

    // Controls
    playPrevious() {
        if (this.playlist.songs.length === 0 || this.currentVideo === null) return;
        else if (this.getCurrentTime() <= 5) {
            if (this.currentVideo > 0) {
                this.currentVideo--;
                return this.loadVideoBySong(this.playlist.songs[this.currentVideo]);
            } else {
                if (this.playerOptions.repeatStatus === YTPlayerRepeat.repeatPlaylist) {
                    this.currentVideo = this.playlist.songs.length - 1;
                    return this.loadVideoBySong(this.playlist.songs[this.currentVideo]);
                } else {
                    return this.seekTo(0);
                }
            }
        }
        else return this.seekTo(0);
    }

    playNext() {
        if (this.playlist.songs.length === 0 || this.currentVideo === null) return;
        else if (this.currentVideo < this.playlist.songs.length - 1) {
            this.currentVideo++;
            return this.loadVideoBySong(this.playlist.songs[this.currentVideo]);
        }
        else if (this.currentVideo === this.playlist.songs.length - 1 && this.playerOptions.repeatStatus === YTPlayerRepeat.repeatPlaylist) {
            this.currentVideo = 0;
            return this.loadVideoBySong(this.playlist.songs[this.currentVideo]);
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
        // this.dispatchOptionsEvent();
    }

    seekTo(seconds, allowSeekAhead = true) {
        this.player.seekTo(seconds, allowSeekAhead);
    }

    loadVideoBySong(song) {
        if (!song) return;
        this.loadVideoById(Store.getState().library[song].youtubeId);
    }

    loadNewSong(song) {
        if (!song) return;
        this.playlist = createPlaylist({ songs: [song] });
        this.currentVideo = 0;
        this.loadVideoById(song.youtubeId);
    }

    loadPlaylist(playlist) {
        if (!playlist) return;
        this.playlist = createPlaylist(playlist);
        this.currentVideo = 0;
    }

    loadPlaylistAndPlay(playlist, index = 0) {
        if (!playlist) return;
        this.playlist = createPlaylist(playlist);
        this.currentVideo = index;
        this.loadVideoBySong(this.playlist.songs[this.currentVideo]);
    }

    playSongAt(idx) {
        if (idx === null || idx === undefined || idx >= this.playlist.songs.length) return;
        if (idx === this.currentVideo) this.seekTo(0);
        else {
            this.currentVideo = idx;
            this.loadVideoBySong(this.playlist.songs[this.currentVideo]);
        }
    }

    loadVideoById(id) {
        this.player.loadVideoById(id);
    }

    queueVideoBySong(song) {
        if (!song) return;
        this.playlist.songs.push(song.id);
        if (this.currentVideo === null) {
            this.currentVideo = 0;
            this.loadVideoBySong(this.playlist.songs[this.currentVideo]);
        }
    }

    removeSongFromPlaylist(song, playlistId) {
        if (!song) return;
        if (!playlistId || (playlistId && this.playlist.id === playlistId)) {
            this.playlist.songs = this.playlist.songs.filter(songId => songId !== song.id);
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
        let playlistMaxIndex = this.playlist.songs.length - 1;
        if (playlistMaxIndex === 0 && repeatStatus === YTPlayerRepeat.repeatPlaylist) repeatStatus = YTPlayerRepeat.repeatOne;
        switch(e.data) {
            case YTPlayerState.ended:
                if (this.currentVideo === null || playlistMaxIndex < 0) return;
                if (repeatStatus === YTPlayerRepeat.repeatOne) this.seekTo(0);
                else if (this.currentVideo < playlistMaxIndex) {
                    this.currentVideo++;
                    this.loadVideoBySong(this.playlist.songs[this.currentVideo]);
                }
                else if (this.currentVideo === playlistMaxIndex) {
                    if (repeatStatus === YTPlayerRepeat.repeatPlaylist) {
                        this.currentVideo = 0;
                        this.loadVideoBySong(this.playlist.songs[this.currentVideo]);
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

export class GlobalYoutubePlayer extends YoutubePlayer {
    constructor(YT, id, element, options = {}) {
        super(YT, id, element, options);
        Store.dispatch({ type: GLOBAL_PLAYER_LOAD, payload: this });
    }

    getCurrentPlaylist() {
        return Store.getState().globalPlayer.playlist;
    }

    // Add Update Reducer functionality    
    // Controls
    playPrevious() {
        super.playPrevious();
        Store.dispatch({ type: GLOBAL_PLAYER_CHANGE_CURRENT, payload: this.currentVideo });
    }

    playNext() {
        super.playNext();
        Store.dispatch({ type: GLOBAL_PLAYER_CHANGE_CURRENT, payload: this.currentVideo });
    }

    loadNewSong(song) {
        super.loadNewSong(song);
        Store.dispatch({ type: GLOBAL_PLAYER_LOAD_PLAYLIST, payload: this.playlist });
    }

    loadPlaylist(playlist) {
        super.loadPlaylist(playlist);
        Store.dispatch({ type: GLOBAL_PLAYER_LOAD_PLAYLIST, payload: this.playlist });
    }

    loadPlaylistAndPlay(playlist, index = 0) {
        super.loadPlaylistAndPlay(playlist, index);
        Store.dispatch({ type: GLOBAL_PLAYER_LOAD_PLAYLIST, payload: this.playlist });
        Store.dispatch({ type: GLOBAL_PLAYER_CHANGE_CURRENT, payload: this.currentVideo });
    }

    playSongAt(idx) {
        super.playSongAt(idx);
        Store.dispatch({ type: GLOBAL_PLAYER_CHANGE_CURRENT, payload: this.currentVideo });
    }

    queueVideoBySong(song) {
        super.queueVideoBySong(song);
        Store.dispatch({ type: GLOBAL_PLAYER_LOAD_PLAYLIST, payload: this.playlist });
        if (Store.getState().globalPlayer.currentVideo !== this.currentVideo) Store.dispatch({ type: GLOBAL_PLAYER_CHANGE_CURRENT, payload: this.currentVideo });
    }

    removeSongFromPlaylist(song, playlistId) {
        super.removeSongFromPlaylist(song, playlistId);
        Store.dispatch({ type: GLOBAL_PLAYER_LOAD_PLAYLIST, payload: this.playlist });
    }

    toggleRepeat() {
        super.toggleRepeat();
        Store.dispatch({ type: GLOBAL_PLAYER_REPEAT, payload: this.playerOptions.repeatStatus });
    }

    onStateChange(e) {
        super.onStateChange(e);
        if (Store.getState().globalPlayer.currentVideo !== this.currentVideo) Store.dispatch({ type: GLOBAL_PLAYER_CHANGE_CURRENT, payload: this.currentVideo });
        Store.dispatch({ type: GLOBAL_PLAYER_UPDATE_STATE, payload: e.data });
    }
}