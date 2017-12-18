import React from "react";
import ReactDom from "react-dom";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { LocaleProvider } from "antd";
// import enUS from "antd/lib/locale-provider/en_US";

// Base Routes and Store
import Routes from "./routes";
import store from "./store";

//  Utilities
import history from "./utils/history";
import cookies from "./utils/cookieManager";

// Action Types
// import { AUTH_USER } from "./actions/types";

// Actions
import { loadUserFromToken } from "./actions/userActions";

// Pages
import Layout from "./pages/Layout";

// Load user if token exists in cookies
const token = cookies.get('token');
if (token) {
    loadUserFromToken({token})(store.dispatch);
}


const app = document.getElementById('root');
ReactDom.render(
    <Provider store={store}>
        <Router history={history}>
            <Routes />
        </Router>
    </Provider>,
    app
)