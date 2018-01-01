import React from "react";
import { Input } from "antd";
import PropTypes from "prop-types";

class ClickInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputVisible: false,
            inputValue: ''
        }

        this.input = null;

        this.handleShowInput = this.handleShowInput.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputConfirm = this.handleInputConfirm.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
    }

    handleShowInput(e) {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    handleInputChange(e) {
        this.setState({ inputValue: e.target.value });
    }

    handleInputConfirm(e) {
        let value = this.state.inputValue;
        if (value !== "" && this.props.confirmHandler) this.props.confirmHandler({value});
        this.setState({ inputVisible: false, inputValue: "" });
    }

    handleInputBlur(e) {
        this.setState({ inputVisible: false, inputValue: "" });
    }

    render() {
        return (
            <React.Fragment>
                {this.state.inputVisible && (
                    <Input
                        ref={input => { this.input = input }}
                        type="text"
                        value={this.state.inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.confirmOnBlur ? this.handleInputConfirm : this.handleInputBlur}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                {!this.state.inputVisible && (
                    <a onClick={this.handleShowInput}>{this.props.children}</a>
                )}
            </React.Fragment>
        )
    }
}

ClickInput.propTypes = {
    confirmHandler: PropTypes.func,
    confirmOnBlur: PropTypes.bool
}

ClickInput.defaultProps = {
    confirmOnBlur: false
}

export default ClickInput;