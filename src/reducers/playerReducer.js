"use strict"

import { createPlaylist } from "../models/creators";
import { PLAYER_LOAD,
         PLAYER_REPEAT,
         PLAYER_CHANGE_CURRENT,
         PLAYER_LOAD_PLAYLIST, 
         PLAYER_UPDATE_STATE,
         PLAYER_LOAD_PLAY_SONG } from "../actions/types";

import { YTPlayerRepeat, YTPlayerState } from "../utils/enums";

const initialState = { };

function createPlayer(ytPlayer) {
    return {
        id: ytPlayer.id,
        ytPlayer: ytPlayer.player,
        playlist: createPlaylist(),
        currentVideo: null,
        playerState: ytPlayer.getPlayerState(),
        repeatStatus: YTPlayerRepeat.repeatOne
    }
}

export default function(state = initialState, action) {
    switch (action.type) {
        case PLAYER_LOAD:
            let player = createPlayer(action.payload);
            return { ...state, [player.id]: player };
        case PLAYER_REPEAT:
            return { ...state, [action.payload.id]: { ...state[action.payload.id], repeatStatus: action.payload.repeatStatus }};
        case PLAYER_CHANGE_CURRENT:
            return { ...state, [action.payload.id]: { ...state[action.payload.id], currentVideo: action.payload.currentVideo }};
        case PLAYER_LOAD_PLAYLIST:
            let newState = { ...state, [action.payload.id]: { ...state[action.payload.id], playlist: action.payload.playlist }};
            if (action.payload.currentVideo) newState.currentVideo = action.payload.currentVideo;
            return newState;
        case PLAYER_UPDATE_STATE:
            return { ...state, [action.payload.id]: { ...state[action.payload.id], playerState: action.payload.playerState }};
        case PLAYER_LOAD_PLAY_SONG:
            return { ...state, [action.payload.id]: { ...state[action.payload.id], currentVideo: action.payload.currentVideo, playlist: action.payload.playlist }};
    }
    return state;
}