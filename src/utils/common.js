// Format Seconds to minutes and seconds
export const formatToMinutes = (seconds) => {
    let m = Math.floor(seconds / 60);
    let s = Math.ceil(seconds % 60);
    return `${Number.isNaN(m) ? "-" : m}:${Number.isNaN(s) ? "--" : (s < 10 ? '0': '')+s}`;
}

export class IdManager {
    constructor(prefix) {
        this.defaultPrefix = prefix;
        this.idCount = 0;
    }

    incrementId(amount = 1) {
        this.idCount += amount;
    }

    generateId(prefix) {
        let result = `${prefix || this.defaultPrefix}-${this.idCount}`;
        this.incrementId();
        return result;
    }
}

export const observeStore = (store, reducer, onChange) => {
    let currentState;
    function handleChange() {
        // let nextState = reducers.length === 0 ? store.getState() : (({ ...reducers }) => ({ ...reducers }))(object);
        let nextState = store.getState()[reducer];
        if (nextState !== currentState) {
            currentState = nextState;
            onChange(currentState);
        }
    }

    let unsubscribe = store.subscribe(handleChange);
    handleChange();
    return unsubscribe();
}