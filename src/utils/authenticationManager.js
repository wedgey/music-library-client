import axios from "axios";
import jwtDecode from "jwt-decode";

import { SERVER_URL } from "../config/main";
import cookies from "./cookieManager";

class AuthenticationManager {
    constructor() {
        this.currentRenewal = null;
    }

    getAuthorizationHeader() {
        return { headers: {"Authorization": cookies.get("token")} };
    }

    async refreshToken() {
        this.currentRenewal = this.currentRenewal ||
                            axios.post(`${SERVER_URL}/auth/refreshToken`, { refreshToken: "" }, this.getAuthorizationHeader())
                                .then(response => { this.storeToken(response.data.token) })
                                .catch(err => console.log(err));
        await this.currentRenewal;
    }

    requiresTokenRefresh() {
        return cookies.get("token") && !this.verifyTokenExpiry();
    }

    storeToken(token) {
        cookies.set("token", token, { path: "/" });
    }

    verifyTokenExpiry() {
        let token = jwtDecode(cookies.get("token"));
        return token.exp > Date.now();
    }
}

const authenticationManager = new AuthenticationManager();
export default authenticationManager;