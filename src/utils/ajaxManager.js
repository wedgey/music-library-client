import axios from "axios";

import authenticationManager from "./authenticationManager";

class AjaxManager {
    constructor() {
        this.defaultOptions = { };
    }

    async get(url, options = {}) {
        if (authenticationManager.requiresTokenRefresh()) await authenticationManager.refreshToken();
        options = Object.assign(this.defaultOptions, authenticationManager.getAuthorizationHeader(), options);
        return axios.get(url, options);
    }

    async post(url, data = {}, options = {}) {
        if (authenticationManager.requiresTokenRefresh()) await authenticationManager.refreshToken();
        options = Object.assign(this.defaultOptions, authenticationManager.getAuthorizationHeader(), options);
        return axios.post(url, data, options);
    }

    async put(url, data = {}, options = {}) {
        if (authenticationManager.requiresTokenRefresh()) await authenticationManager.refreshToken();
        options = Object.assign(this.defaultOptions, authenticationManager.getAuthorizationHeader(), options);
        return axios.put(url, data, options);
    }

    async delete(url, options = {}) {
        if (authenticationManager.requiresTokenRefresh()) await authenticationManager.refreshToken();
        options = Object.assign(this.defaultOptions, authenticationManager.getAuthorizationHeader(), options);
        return axios.delete(url, options);
    }
}

const ajaxManager = new AjaxManager();
export default ajaxManager;