import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { RoleGroups } from "../../config/roles";

const AuthorizationHandler = (allowedRoles) => {
    return (WrappedComponent) => {
        class WithAuthorization extends React.Component {
            constructor(props){
                super(props);
            }

            render() {
                const { role } = this.props.user;
                if (allowedRoles.includes(role)) {
                    return <WrappedComponent />
                } else {
                    if (role === undefined) return <Redirect to="/login" />;
                    else return <Redirect to="/" />
                }
            }
        }
        
        function mapStateToProps(store) {
            return {
                user: store.user
            };
        }

        return connect(mapStateToProps, {})(WithAuthorization);
    }
}

export default AuthorizationHandler;