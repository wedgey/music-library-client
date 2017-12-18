import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { loginUser } from "../../actions/userActions";

class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) this.props.loginUser(values);
        });
    }

    render() {
        let { getFieldDecorator } = this.props.form;
        return (
            <Form hideRequiredMark onSubmit={this.handleSubmit} className="form-login-form">
                <Form.Item className="margin-bottom-sm indent-label" colon={false} label="Email">
                    {getFieldDecorator('email', {
                        rules: [{ required: true, message: 'Please enter your email'}]
                    })(
                        <Input size="large" placeholder="Email" />
                    )}
                </Form.Item>
                <Form.Item className="margin-bottom-sm indent-label" colon={false} label="Password">
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please enter  your password' }]
                    })(
                        <Input size="large" placeholder="Password" type="password" />
                    )}
                </Form.Item>
                <Form.Item className="margin-bottom-sm">
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true
                    })(
                        <Checkbox>Remember me</Checkbox>
                    )}
                    <a style={{float: 'right'}} href="#">Forgot password?</a>
                </Form.Item>
                <Form.Item>
                    <Button size="large" style={{width: '100%'}} type="primary" htmlType="submit">LOGIN</Button>
                </Form.Item>
                <Form.Item className="text-center">
                    <span>Don't have an account? <Link to="/register">Sign up</Link>!</span>
                </Form.Item>
            </Form>
        )
    }
}

const mapStoreToProps = (store) => {
    return { };
}

LoginForm = Form.create()(LoginForm);
export default connect(mapStoreToProps, { loginUser })(LoginForm);