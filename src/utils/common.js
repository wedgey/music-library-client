// Format Seconds to minutes and seconds
export const formatToMinutes = (seconds) => {
    let m = Math.floor(seconds / 60);
    let s = Math.ceil(seconds % 60);
    return `${m}:${s < 10 ? '0': ''}${s}`;
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