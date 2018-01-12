class ReactorEvent {
    constructor(name) {
        this.name = name;
        this.callbacks = [];
    }

    registerCallback(callback) {
        this.callbacks.push(callback);
    }

    unregisterCallback(callback) {
        let index = this.callbacks.indexOf(callback);
        if (index > -1) this.callbacks.splice(index, 1);
    }
}

class Reactor {
    constructor() {
        this.events = {};
    }

    registerEvent(eventName) {
        let event = new ReactorEvent(eventName);
        this.events[eventName] = event;
    }

    dispatchEvent(eventName, eventArgs) {
        let event = this.events[eventName];
        if (event) {
            event.callbacks.forEach((callback) => callback(eventArgs));
        } else {
            console.error(`WARNING: can't dispatch "${eventName}"`);
        }
    }

    addEventListener(eventName, callback) {
        let event = this.events[eventName];
        if (event) event.registerCallback(callback);
    }

    removeEventListener(eventName, callback) {
        let event = this.events[eventName];
        if (event) {
            event.unregisterCallback(callback);
            delete this.events[eventName];
        } else {
            console.error(`ERROR: can't delete "${eventName}"`);
        }
    }
}

const reactor = new Reactor();
export default reactor;