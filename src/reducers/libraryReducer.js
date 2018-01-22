import { LIBRARY_ADD, LIBRARY_LOAD } from "../actions/types";

const initialState = {};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case LIBRARY_ADD:
            return { ...state, [action.payload.id]: action.payload };
        case LIBRARY_LOAD:
            return { ...state, ...action.payload };
    }
    return state;
}