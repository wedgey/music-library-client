class IdManager {
    constructor() {
        this.idCount = 0;
    }

    generateId(prefix) {
        let result = `${prefix}-${this.idCount}`;
        incrementId();
        return result;
    }

    incrementId(amount = 1) {
        this.idCount += amount;
    }
}
const idManager = new IdManager();
exports.idManager = idManager;

exports.getNameValuePair = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    return { [name]: value };
}

exports.getValue = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    return value;
}