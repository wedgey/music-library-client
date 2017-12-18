import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";

class RouteWithLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { user, allowedRoles, layout, component, roleRedirectTo, ...rest } = this.props;
        const { role } = user;
        if (allowedRoles.includes(role)) {
            return (
                <Route {...rest} render={props => layout ? React.createElement(layout, props, React.createElement(component, props)) : React.createElement(component, props)} />
            )
        } else {
            if (role === undefined) return <Redirect to="/login" />;
            // else return <Redirect to="/" />
            else return roleRedirectTo ? 
                <Redirect to={roleRedirectTo} /> :
                <Route {...rest} render={props => layout ? React.createElement(layout, props, <div><h1>Sorry, only admins currently have access to this.</h1></div>) : <div><h1>Sorry, only admins currently have access to this</h1></div>} />;
        }
    }
}

const mapStoreToProps = (store) => {
    return {
        user: store.user
    }
}

export default connect(mapStoreToProps, {})(RouteWithLayout);