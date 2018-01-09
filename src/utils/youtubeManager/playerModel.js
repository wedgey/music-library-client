"use strict"

import { YTPlayerState, YTPlayerRepeat } from "../enums";
import Store from "../../store";
import { PLAYER_LOAD,
         PLAYER_REPEAT,
         PLAYER_CHANGE_CURRENT,
         PLAYER_LOAD_PLAYLIST,
         PLAYER_UPDATE_STATE,
         PLAYER_LOAD_PLAY_SONG } from "../../actions/types";

import { createPlaylist } from "../../models/creators";
import { observeStore } from "../../utils/common";

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
    }

    storeListener(newStore) {
        this.storedPlayer = newStore[this.id];
    }

    // METHODS
    getCurrentPlaylist() {
        return Store.getState().player[this.id].playlist;
    }

    getCurrentSong() {
        return Store.getState().library[this.storedPlayer.playlist.songs[this.storedPlayer.currentVideo]];
    }

    getCurrentTime() {
        return this.player.getCurrentTime();
    }

    getDuration() {
        return this.player.getDuration();
    }

    getPlayerState() {
        return this.player.getPlayerState();
        // return this.storedPlayer.playerState;
    }

    // YTPLAYER CONTROLS
    loadVideoById(id) {
        this.player.loadVideoById(id);
    }

    loadVideoBySong(song) {
        if (!song) return;
        this.loadVideoById(Store.getState().library[song].youtubeId);
    }

    loadVideoBySongIndex(index) {
        if (index === undefined) return;
        Store.dispatch({ type: PLAYER_CHANGE_CURRENT, payload: { id: this.id, currentVideo: index} });
        this.loadVideoBySong(this.storedPlayer.playlist.songs[index]);
    }

    loadNewSong(song) {
        if (!song) return;
        let playlist = createPlaylist({ songs: [song] });
        Store.dispatch({ type: PLAYER_LOAD_PLAY_SONG, payload: { id: this.id, currentVideo: 0, playlist }});
        this.loadVideoById(song.youtubeId);
    }

    loadPlaylist(playlist) {
        if (!playlist) return;
        Store.dispatch({ type: PLAYER_LOAD_PLAYLIST, payload: { id: this.id, playlist: createPlaylist(playlist) }});
    }

    loadPlaylistAndPlay(playlist, index = 0) {
        if (!playlist) return;
        let newPlaylist = createPlaylist(playlist);
        Store.dispatch({ type: PLAYER_LOAD_PLAY_SONG, payload: { id: this.id, currentVideo: index, playlist }});
        this.loadVideoBySong(this.storedPlayer.playlist.songs[this.storedPlayer.currentVideo]);
    }

    seekTo(seconds, allowSeekAhead = true) {
        this.player.seekTo(seconds, allowSeekAhead);
    }

    // CONTROLS
    playPrevious() {
        let { currentVideo } = this.storedPlayer;
        if (this.storedPlayer.playlist.songs.length === 0 || this.storedPlayer.currentVideo === null) return;
        else if (this.getCurrentTime() <= 5) {
            if (currentVideo > 0) {
                currentVideo--;
                return this.loadVideoBySongIndex(currentVideo);
            } else {
                if (this.storedPlayer.repeatStatus === YTPlayerRepeat.repeatPlaylist) {
                    currentVideo = this.storedPlayer.playlist.songs.length - 1;
                    return this.loadVideoBySongIndex(currentVideo);
                } else {
                    return this.seekTo(0);
                }
            }
        }
        else return this.seekTo(0);
    }

    playNext() {
        let { currentVideo, playlist, repeatStatus } = this.storedPlayer;
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
        if (index === null || index === undefined || index >= this.storedPlayer.playlist.songs.length) return;
        if (index === this.storedPlayer.currentVideo) this.seekTo(0);
        else {
            this.loadVideoBySongIndex(index);
        }
    }

    togglePlay() {
        this.getPlayerState() === YTPlayerState.playing ? this.pauseVideo() : this.playVideo();
    }

    toggleRepeat() {
        let repeatStatus = this.storedPlayer.repeatStatus;
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
        Store.dispatch({ type: PLAYER_REPEAT, payload: { id: this.id, repeatStatus }});
    }

    queueVideoBySong(song) {
        if (!song) return;
        let currentPlaylist = this.getCurrentPlaylist();
        let playlist = { ...currentPlaylist, songs: [...currentPlaylist[songs], song.id] };
        if (this.storedPlayer.currentVideo === null) this.loadPlaylistAndPlay(playlist);
        else this.loadPlaylist(playlist);
    }

    removeSongFromPlaylist(song, playlistId) {
        if (!song) return;
        let playlist = { ...this.getCurrentPlaylist() };
        if (!playlistId || (playlistId && playlist.id === playlistId)) {
            let originalSongCount = playlist.songs.length;
            playlist.songs = playlist.songs.filter(songId => songId !== song.id);
            let songCountDiff = originalSongCount - playlist.songs.length;
            if (songCountDiff) this.loadPlaylistAndPlay(playlist, this.storedPlayer.currentVideoo - songCountDiff);
        }
    }

    destroy() {
        this.player.destroy();
    }

    // EVENT HANDLERS
    onReady(e) {
        Store.dispatch({ type: PLAYER_LOAD, payload: this });
        this.removeStoreListener = observeStore(Store, "player", this.storeListener.bind(this));
    }

    onStateChange(e) {
        let { currentVideo, repeatStatus, playlist } = this.storedPlayer;
        let playlistMaxIndex = playlist.songs.length - 1;
        if (playlistMaxIndex === 0 && repeatStatus === YTPlayerRepeat.repeatPlaylist) repeatStatus = YTPlayerRepeat.repeatOne;
        switch(e.data) {
            case YTPlayerState.ended:
                if (currentVideo === null || playlistMaxIndex < 0) return;
                if (repeatStatus === YTPlayerRepeat.repeatOne) this.seekTo(0);
                else if (currentVideo < playlistMaxIndex) return this.loadVideoBySongIndex(currentVideo + 1);
                else if (currentVideo === playlistMaxIndex) {
                    if (repeatStatus === YTPlayerRepeat.repeatPlaylist) {
                        return this.loadVideoBySongIndex(0);
                    }
                }
        }
        Store.dispatch({ type: PLAYER_UPDATE_STATE, payload: {id: this.id, playerState: e.data}});
    }
}