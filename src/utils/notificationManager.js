import { notification } from "antd";

class NotificationManager {
    constructor(options) {
        this.NotificationTypes = { General: "GENERAL", Player: "PLAYER" };
        this.defaultOptions = {};
        this.defaultOptions[this.NotificationTypes.General] = { bottom: 40 };
        this.defaultOptions[this.NotificationTypes.Player] = { placement: 'bottomRight', duration: 1.5 };
        notification.config(this.defaultOptions[this.NotificationTypes.General]);
    }

    formatConfig({type, ...rest}) {
        return {...(this.defaultOptions[type] || {}), ...rest};
    }

    showNotification(config = {}) {
        notification.open(this.formatConfig(config));
    }

    showSuccessNotification(config = {}) {
        notification.success(this.formatConfig(config));
    }

    showErrorNotification(config = {}) {
        notification.error(config);
    }

    showInfoNotification(config = {}) {
        notification.info(config);
    }

    showWarningNotification(config = {}) {
        notification.warning(config);
    }

    showWarnNotification(config = {}) {
        notification.warn(config);
    }

    closeNotification(key) {
        notification.close(key);
    }
}

NotificationManager = new NotificationManager();
export default NotificationManager;