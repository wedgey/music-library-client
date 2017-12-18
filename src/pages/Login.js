import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Card, Col, Row } from "antd";

import { loginUser } from "../actions/userActions";

import LoginForm from "../components/forms/loginForm";

import ImgLogo from "../images/logo.svg";

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin() {
        let email = "desmondpoon5@hotmail.com";
        let password = "boomboomgone";
        this.props.loginUser({email, password});
    }

    render() {
        if (this.props.user.id) return <Redirect to="/" />
        return (
            // <div className="page-login">
            //     Login Page
            //     <button onClick={this.handleLogin}>Login Now</button>
            // </div>
            <div className="page-login">
                <Row type="flex" align="middle" style={{height: '100vh'}}>
                    <Col className="image-container hidden-xs"></Col>
                    <Col className="login-container">
                        <Card bordered={false}>
                            <div className="text-center">
                                <img src={ImgLogo} />
                                <br /><br />
                                <h1><strong style={{letterSpacing: '2px'}}>KPopLibrary</strong></h1>
                                <span>Sign in to your account below...</span>
                                <br /><br />
                            </div>
                            <LoginForm />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        user: store.user
    }
}

export default connect(mapStateToProps, { loginUser })(Login);