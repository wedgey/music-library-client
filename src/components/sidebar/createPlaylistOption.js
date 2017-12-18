import React from "react";
import { Icon, Input } from "antd";

class CreatePlaylistOption extends React.Component {
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
    }

    handleShowInput(e) {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    handleInputChange(e) {
        this.setState({ inputValue: e.target.value });
    }

    handleInputConfirm(e) {
        let name = this.state.inputValue;
        if (name !== "" && this.props.createPlaylist) this.props.createPlaylist({name});
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
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                {!this.state.inputVisible && (
                    <a onClick={this.handleShowInput}><Icon type="file-add" /> Create Playlist</a>
                )}
            </React.Fragment>
        )
    }
    
}

export default CreatePlaylistOption;