"use strict"

import { createPlaylist } from "../models/creators";
import { PLAYERS_LOAD,
         PLAYERS_SET_READY,
         PLAYERS_REPEAT,
         PLAYERS_CHANGE_CURRENT,
         PLAYERS_LOAD_PLAYLIST, 
         PLAYERS_UPDATE_STATE,
         PLAYERS_LOAD_PLAY_SONG,
         PLAYERS_DESTROY } from "../actions/types";

import { YTPlayerRepeat, YTPlayerState } from "../utils/enums";

const initialState = { };

function createPlayer(ytPlayer) {
    return {
        id: ytPlayer.id,
        isReady: false,
        ytPlayer: ytPlayer.player,
        playlist: createPlaylist(),
        currentVideo: null,
        playerState: YTPlayerState.unstarted,
        repeatStatus: YTPlayerRepeat.repeatPlaylist
    }
}

export default function(state = initialState, action) {
    switch (action.type) {
        case PLAYERS_LOAD:
            let player = createPlayer(action.payload);
            return { ...state, [player.id]: player };
        case PLAYERS_SET_READY:
            return { ...state, [action.payload.id]: { ...state[action.payload.id], isReady: action.payload.isReady } };
        case PLAYERS_REPEAT:
            return { ...state, [action.payload.id]: { ...state[action.payload.id], repeatStatus: action.payload.repeatStatus }};
        case PLAYERS_CHANGE_CURRENT:
            return { ...state, [action.payload.id]: { ...state[action.payload.id], currentVideo: action.payload.currentVideo }};
        case PLAYERS_LOAD_PLAYLIST:
            let newState = { ...state, [action.payload.id]: { ...state[action.payload.id], playlist: action.payload.playlist }};
            if (action.payload.currentVideo) newState.currentVideo = action.payload.currentVideo;
            return newState;
        case PLAYERS_UPDATE_STATE:
            return { ...state, [action.payload.id]: { ...state[action.payload.id], playerState: action.payload.playerState }};
        case PLAYERS_LOAD_PLAY_SONG:
            return { ...state, [action.payload.id]: { ...state[action.payload.id], currentVideo: action.payload.currentVideo, playlist: action.payload.playlist }};
        case PLAYERS_DESTROY:
            let { [action.payload.id]: destroyedPlayer, ...rest } = state;
            return { ...rest };
    }
    return state;
}