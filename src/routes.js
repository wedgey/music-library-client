import React from "react";
import { withRouter } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";

import RouteWithLayout from "./components/routeWithLayoutHOC";
import { RoleGroups } from "./config/roles";

// Layouts
import Layout from "./pages/Layout";

// Pages
import AddSong from "./pages/AddSong";
import Library from "./pages/Library";
import Login from "./pages/Login";
import NowPlaying from "./pages/NowPlaying";
import Register from "./pages/Register";
import Playlist from "./pages/Playlist";

// Admin Pages
import AdminManageSongs from "./pages/admin/ManageSongs";

class Routes extends React.PureComponent { // Uses pure component to prevent updating of child if no prop changes affects it ie. ui toggles
    constructor(props) {
        super(props);
        this.previousLocation = this.props.location;

        this.GuestOnly = RoleGroups.guest;
        this.Members = RoleGroups.member;
        // this.Moderator = AuthorizationManager(RoleGroups.moderator);
        this.Admin = RoleGroups.admin;
        // this.Owner = AuthorizationManager(RoleGroups.owner);
    }

    componentWillUpdate(nextProps) {
        const { location } = this.props;
        if (
            nextProps.history.action !== 'POP' &&
            (!location.state || !location.state.modal)
        ) {
            this.previousLocation = this.props.location;
        }
    }

    render() {
        const { location } = this.props;
        const isModal = !!(
            location.state &&
            location.state.modal &&
            this.previousLocation !== location
        );

        return (
            <Switch location={isModal ? this.previousLocation : location}>
                <RouteWithLayout exact path="/login" component={Login} allowedRoles={this.GuestOnly} roleRedirectTo="/" />
                <RouteWithLayout exact path="/register" component={Register} allowedRoles={this.GuestOnly} roleRedirectTo="/" />
                <RouteWithLayout exact path="/addsong" layout={Layout} component={AddSong} allowedRoles={this.Admin} />
                <RouteWithLayout exact path="/library" layout={Layout} component={Library} allowedRoles={this.Members} />
                <RouteWithLayout exact path="/nowplaying" layout={Layout} component={NowPlaying} allowedRoles={this.Members} />
                <RouteWithLayout exact path="/playlist/:id" layout={Layout} component={Playlist} allowedRoles={this.Members} />

                <RouteWithLayout exact path="/admin/managesongs" layout={Layout} component={AdminManageSongs} allowedRoles={this.Admin} />

                <RouteWithLayout path="*" layout={Layout} component={Library} allowedRoles={this.Members} />
            </Switch>
        );
    }
}

Routes.propTypes = {
    location: PropTypes.object.isRequired
}

export default withRouter(Routes);