"use strict"

import { YTPlayerState, YTPlayerRepeat } from "../enums";
import Store from "../../store";
import { PLAYERS_LOAD,
         PLAYERS_SET_READY,
         PLAYERS_REPEAT,
         PLAYERS_CHANGE_CURRENT,
         PLAYERS_LOAD_PLAYLIST,
         PLAYERS_UPDATE_STATE,
         PLAYERS_LOAD_PLAY_SONG,
         PLAYERS_DESTROY } from "../../actions/types";

import { createPlaylist } from "../../models/creators";
import { observeStore } from "../../utils/common";
import Reactor from "../../utils/reactor";

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
                enablejsapi: 1
            }
        }

        this.player = new YT.Player(element, { ...defaultPlayerOptions, ...options });
        this.player.addEventListener('onReady', this.onReady.bind(this));
        this.player.addEventListener('onStateChange', this.onStateChange.bind(this));

        this.id = id;
        this.storedPlayer = null;
        this.eventDispatcher = Reactor;
        this.eventDispatcher.registerEvent(`${this.id}_events`);

        this.timePollIntervalId = null;

        Store.dispatch({ type: PLAYERS_LOAD, payload: this });
    }

    storeListener(newStore) {
        this.storedPlayer = newStore[this.id];
    }

    // METHODS
    getCurrentPlaylist() {
        return Store.getState().players[this.id].playlist;
    }

    getCurrentSong() {
        let state = Store.getState();
        return state.library[state.players[this.id].playlist.songs[state.players[this.id].currentVideo]];
    }

    getCurrentTime() {
        return this.player.getCurrentTime();
    }

    getDuration() {
        return this.player.getDuration();
    }

    getPlayerState() {
        return Store.getState().players[this.id].playerState;
    }

    getStorePlayer() {
        return Store.getState().players[this.id];
    }

    // YTPLAYER CONTROLS
    loadVideoById(id) {
        this.player.loadVideoById(id);
    }

    loadVideoBySong(song) {
        if (!song) return;
        this.loadVideoById(Store.getState().library[song.id].youtubeId);
    }

    loadVideoBySongId(songId) {
        if (songId === undefined) return;
        this.loadVideoById(Store.getState().library[songId].youtubeId);
    }

    loadVideoBySongIndex(index) {
        if (index === undefined) return;
        Store.dispatch({ type: PLAYERS_CHANGE_CURRENT, payload: { id: this.id, currentVideo: index} });
        let player = Store.getState().players[this.id];
        this.loadVideoBySongId(player.playlist.songs[player.currentVideo]);
    }

    loadNewSong(song) {
        if (!song) return;
        let playlist = createPlaylist({ songs: [song] });
        Store.dispatch({ type: PLAYERS_LOAD_PLAY_SONG, payload: { id: this.id, currentVideo: 0, playlist }});
        this.loadVideoById(song.youtubeId);
    }

    loadPlaylist(playlist) {
        if (!playlist) return;
        if (playlist.songs.length > 0 && (playlist.songs[0].id || playlist.songs[0]._id)) playlist = createPlaylist(playlist);
        Store.dispatch({ type: PLAYERS_LOAD_PLAYLIST, payload: { id: this.id, playlist: playlist }});
    }

    loadPlaylistAndPlay(playlist, index = 0) {
        if (!playlist) return;
        let newPlaylist = createPlaylist(playlist);
        Store.dispatch({ type: PLAYERS_LOAD_PLAY_SONG, payload: { id: this.id, currentVideo: index, playlist: newPlaylist }});
        let player = Store.getState().players[this.id];
        this.loadVideoBySongId(player.playlist.songs[player.currentVideo]);
    }

    seekTo(seconds, allowSeekAhead = true) {
        this.player.seekTo(seconds, allowSeekAhead);
        if (this.timePollIntervalId === null) this.dispatchEvent({ currentTime: 0, duration: this.getDuration() });
    }

    // CONTROLS
    playPrevious() {
        let { currentVideo, playlist, repeatStatus } = Store.getState().players[this.id];
        if (playlist.songs.length === 0 || currentVideo === null) return;
        else if (this.getCurrentTime() <= 5) {
            if (currentVideo > 0) {
                currentVideo--;
                return this.loadVideoBySongIndex(currentVideo);
            } else {
                if (repeatStatus === YTPlayerRepeat.repeatPlaylist) {
                    currentVideo = playlist.songs.length - 1;
                    return this.loadVideoBySongIndex(currentVideo);
                } else {
                    return this.seekTo(0);
                }
            }
        }
        else return this.seekTo(0);
    }

    playNext() {
        let { currentVideo, playlist, repeatStatus } = Store.getState().players[this.id];
        if (playlist.songs.length === 0 || currentVideo === null) return;
        else if (currentVideo < playlist.songs.length - 1) {
            currentVideo++;
            return this.loadVideoBySongIndex(currentVideo);
        }
        else if (currentVideo === playlist.songs.length - 1 && repeatStatus === YTPlayerRepeat.repeatPlaylist) {
            currentVideo = 0;
            return this.loadVideoBySongIndex(currentVideo);
        }
        else if (repeatStatus === YTPlayerRepeat.repeatOne) return this.seekTo(0);
        else return this.seekTo(this.getDuration());
    }

    playVideo() {
        this.player.playVideo();
    }

    pauseVideo() {
        this.player.pauseVideo();
    }

    playSongAt(index) {
        let player = this.getStorePlayer();
        if (index === null || index === undefined || index >= player.playlist.songs.length) return;
        if (index === player.currentVideo) this.seekTo(0);
        else {
            this.loadVideoBySongIndex(index);
        }
    }

    togglePlay() {
        this.getPlayerState() === YTPlayerState.playing ? this.pauseVideo() : this.playVideo();
    }

    toggleRepeat() {
        let repeatStatus = Store.getState().players[this.id].repeatStatus;
        switch (repeatStatus) {
            case YTPlayerRepeat.normal:
                repeatStatus = YTPlayerRepeat.repeatOne;
                break;
            case YTPlayerRepeat.repeatOne:
                repeatStatus = YTPlayerRepeat.repeatPlaylist;
                break;
            case YTPlayerRepeat.repeatPlaylist:
                repeatStatus = YTPlayerRepeat.normal;
                break;
        }
        Store.dispatch({ type: PLAYERS_REPEAT, payload: { id: this.id, repeatStatus }});
    }

    queueVideoBySong(song) {
        if (!song) return;
        let currentPlaylist = this.getCurrentPlaylist();
        let playlist = { ...currentPlaylist, songs: [...currentPlaylist.songs, song.id] };
        if (Store.getState().players[this.id].currentVideo === null) this.loadPlaylistAndPlay(playlist);
        else this.loadPlaylist(playlist);
    }

    removeSongFromPlaylist(song, playlistId) {
        if (!song) return;
        let playlist = { ...this.getCurrentPlaylist() };
        if (!playlistId || (playlistId && playlist.id === playlistId)) {
            let originalSongCount = playlist.songs.length;
            playlist.songs = playlist.songs.filter(songId => songId !== song.id);
            let songCountDiff = originalSongCount - playlist.songs.length;
            if (songCountDiff) {
                let player = Store.getState().players[this.id];
                Store.dispatch({ type: PLAYERS_LOAD_PLAY_SONG, payload: { id: this.id, currentVideo: player.currentVideo - songCountDiff, playlist: playlist }});
                player = Store.getState().players[this.id];
                this.loadVideoBySongId(player.playlist.songs[player.currentVideo]);
            }
        }
    }

    destroy() {
        this.player.destroy();
        Store.dispatch({ type: PLAYERS_DESTROY, payload: { id: this.id} });
    }

    // EVENT HANDLERS
    onReady(e) {
        Store.dispatch({ type: PLAYERS_SET_READY, payload: {id: this.id, isReady: true } });
        this.removeStoreListener = observeStore(Store, "player", this.storeListener.bind(this));
    }

    onStateChange(e) {
        let { currentVideo, repeatStatus, playlist } = Store.getState().players[this.id];
        let playlistMaxIndex = playlist.songs.length - 1;
        if (playlistMaxIndex === 0 && repeatStatus === YTPlayerRepeat.repeatPlaylist) repeatStatus = YTPlayerRepeat.repeatOne;
        switch(e.data) {
            case YTPlayerState.playing:
                if (this.timePollIntervalId) clearInterval(this.timePollIntervalId);
                this.timePollIntervalId = setInterval(this.handleTimeUpdate.bind(this), 100);
                break;
            case YTPlayerState.ended:
                if (currentVideo === null || playlistMaxIndex < 0) return;
                if (repeatStatus === YTPlayerRepeat.repeatOne) this.seekTo(0);
                else if (currentVideo < playlistMaxIndex) this.loadVideoBySongIndex(currentVideo + 1);
                else if (currentVideo === playlistMaxIndex) {
                    if (repeatStatus === YTPlayerRepeat.repeatPlaylist) {
                        this.loadVideoBySongIndex(0);
                    }
                }
                if (this.timePollIntervalId) {
                    this.dispatchEvent({ currentTime: 0 });
                    clearInterval(this.timePollIntervalId);
                    this.timePollIntervalId = null;
                }
                break;
            default:
                if (this.timePollIntervalId) {
                    clearInterval(this.timePollIntervalId);
                    this.timePollIntervalId = null;
                }
        }
        Store.dispatch({ type: PLAYERS_UPDATE_STATE, payload: {id: this.id, playerState: e.data}});
    }

    handleTimeUpdate() {
        let currentTime = this.getCurrentTime();
        let duration = this.getDuration();
        this.dispatchEvent({ currentTime, duration });
    }

    dispatchEvent(args) {
        this.eventDispatcher.dispatchEvent(`${this.id}_events`, args);
    }

    subscribeToTime(callback) {
        this.eventDispatcher.addEventListener(`${this.id}_events`, callback);
    }

    unsubscribeFromTime(callback) {
        this.eventDispatcher.removeEventListener(`${this.id}_events`, callback);
    }
}