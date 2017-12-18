import React from "react";

import RegisterForm from "../components/forms/registerForm";

class Register extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="page-register">
                <RegisterForm />
            </div>
        )
    }
}

export default Register;