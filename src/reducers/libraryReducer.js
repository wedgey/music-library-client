import { createSong } from "../models/creators";
import { LIBRARY_ADD, LIBRARY_LOAD } from "../actions/types";

const initialState = {
    songs: []
};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case LIBRARY_ADD:
            return { ...state, songs: [...state.songs, createSong(action.payload.data)] };
        case LIBRARY_LOAD:
            return { ...state, songs: action.payload.data.map(song => createSong(song))};
    }
    return state;
}