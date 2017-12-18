import axios from "axios";

import cookies from "./cookieManager";

class AjaxManager {
    constructor() {
        this.defaultOptions = { };
    }

    get(url, options = {}) {
        options = Object.assign(this.defaultOptions, { headers: {"Authorization": cookies.get("token")} }, options);
        return axios.get(url, options);
    }

    post(url, data = {}, options = {}) {
        options = Object.assign(this.defaultOptions, { headers: {"Authorization": cookies.get("token")} }, options);
        return axios.post(url, data, options);
    }

    put(url, data = {}, options = {}) {
        options = Object.assign(this.defaultOptions, { headers: {"Authorization": cookies.get("token")} }, options);
        return axios.put(url, data, options);
    }

    delete(url, options = {}) {
        options = Object.assign(this.defaultOptions, { headers: {"Authorization": cookies.get("token")} }, options);
        return axios.delete(url, options);
    }
}

const ajaxManager = new AjaxManager();
export default ajaxManager;