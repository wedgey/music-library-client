import React from "react";
import { connect } from "react-redux";
import { Button, Checkbox, Form, Input } from "antd";
import { registerUser } from "../../actions/userActions";

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.registerUser(values);
            }
        });
    }

    render() {
        let { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="form-register-form">
                <Form.Item className="margin-bottom-sm indent-label" colon={false} label="Email">
                    {getFieldDecorator('email', {
                        rules: [{ required: true, message: 'Please enter your email'}, { type: 'email', message: 'Please enter a valid email'}]
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
                <Form.Item>
                    <Button size="large" style={{width: '100%'}} type="primary" htmlType="submit">REGISTER</Button>
                </Form.Item>
            </Form>
        )
    }
}

const mapStoreToProps = function(store) {
    return {

    }
}

RegisterForm = Form.create()(RegisterForm);
export default connect(mapStoreToProps, { registerUser })(RegisterForm);