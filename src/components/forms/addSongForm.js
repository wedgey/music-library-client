import React from "react";
import { AutoComplete, Button, Card, Col, Form, Input, Row } from "antd";
import { connect } from "react-redux";

import TagInput from "../forms/tagInput";

import LocalizationManager from "../../localization";
import { addSong } from "../../actions/libraryActions";
import youtubeManager from "../../utils/youtubeManager";
import { getArtists } from "../../dataManager/artists";

class AddSongForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            artistsAutoComplete: [],
            artist: [],
            artistInputValue: ""
        }

        this.artistSelectedEvent = false;
        this.player = null;
        this.stringObj = LocalizationManager.localization;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleYoutubeId = this.handleYoutubeId.bind(this);
        this.loadYoutubeVideo =  this.loadYoutubeVideo.bind(this);
        this.handleArtistsComplete = this.handleArtistsComplete.bind(this);
        this.handleArtistSelect = this.handleArtistSelect.bind(this);
        this.onArtistInputChange = this.onArtistInputChange.bind(this);
        this.handleTagClose = this.handleTagClose.bind(this);
        this.validateArtist = this.validateArtist.bind(this);
    }

    componentWillUnmount() {
        if (this.player) youtubeManager.destroyPlayer(this.player.id);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields({force: true}, (err, values) => {
            if (!err) {
                values.artist = this.state.artist;
                this.props.addSong(values);
            }
        });
    }

    handleYoutubeId(e) {
        if (!e || !e.target) return e;
        const { target } = e;
        this.loadYoutubeVideo(target.value);
        return target.type === 'checkbox' ? target.checked : target.value;
    }

    handleArtistsComplete(name = "") {
        getArtists({name}, (response) => {
            let artistsAutoComplete = response.data.artists;
            if (artistsAutoComplete) artistsAutoComplete = artistsAutoComplete.map(artist => artist.name);
            this.setState({ artistsAutoComplete });
        });
    }

    handleArtistSelect(value, option) {
        if (!this.state.artist.includes(value)) this.setState({artist: [...this.state.artist, value]}, () => this.props.form.validateFields(['artist'], { force: true }));
        this.artistSelectedEvent = true;
    }

    onArtistInputChange(value, label) {
        if (this.artistSelectedEvent) {
            this.setState({ artistInputValue: "" });
            this.artistSelectedEvent = false;
        } else {
            if (value.slice(-1) === ",") {
                let newArtistName = value.substr(0, value.length - 1);
                if (!this.state.artist.includes(newArtistName)) this.setState({artist: [...this.state.artist, newArtistName], artistInputValue: ""}, () => this.props.form.validateFields(['artist'], {force: true}));
            } else {
                this.setState({ artistInputValue: value });
            }
        }
    }

    validateArtist(rule, value, callback) {
        if (this.state.artist.length > 0) callback();
        else callback(new Error(this.stringObj.formsText.addSongForm.artistRequireError));
    }

    handleTagClose(tag) {
        this.setState({ artist: this.state.artist.filter(a => a !== tag) }, () => this.props.form.validateFields(['artist'], {force: true}));
    }

    async loadYoutubeVideo(id) {
        if (!this.player) {
            let options = { videoId: id, playerVars: { playlist: id }};
            let playerId = await youtubeManager.createYoutubePlayer(this.youtubePlayerElement, options);
            this.player = youtubeManager.getPlayer(playerId);
        }
        else
        {
            this.player.loadVideoById(id);
        }
    }

    render() {
        let { getFieldDecorator } = this.props.form;
        return (
            <Form className="form-add-song-form" onSubmit={this.handleSubmit}>
                <Row type="flex">
                    <Col span={12}>
                        <Form.Item className="margin-bottom-sm indent-label" colon={false} label={this.stringObj.formsText.addSongForm.titleLabel}>
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: this.stringObj.formsText.addSongForm.titleRquireError}]
                            })(
                                <Input placeholder={this.stringObj.formsText.addSongForm.titlePlaceholder} />
                            )}
                        </Form.Item>
                        <Form.Item className="margin-bottom-sm indent-label" colon={false} label={this.stringObj.formsText.addSongForm.artistLabel}>
                            {getFieldDecorator('artist', {
                                rules: [{ validator: this.validateArtist }],
                            })(
                                <TagInput tags={this.state.artist} tagProps={{closable: true, onClose: this.handleTagClose}}>
                                    <AutoComplete dataSource={this.state.artistsAutoComplete} onSearch={this.handleArtistsComplete} onSelect={this.handleArtistSelect} value={this.state.artistInputValue} onChange={this.onArtistInputChange} placeholder={this.stringObj.formsText.addSongForm.artistPlaceholder} />
                                </TagInput>
                            )}
                        </Form.Item>
                        <Form.Item className="margin-bottom-sm indent-label" colon={false} label={this.stringObj.formsText.addSongForm.linkLabel}>
                            {getFieldDecorator('youtubeId', {
                                rules: [{ required: true, message: this.stringObj.formsText.addSongForm.linkRequireError }],
                                getValueFromEvent: this.handleYoutubeId
                            })(
                                <Input placeholder={this.stringObj.formsText.addSongForm.linkPlaceholder} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12} style={{padding: '10px'}}>
                        <div ref={r => this.youtubePlayerElement = r}></div>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-right" span={24}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">{this.stringObj.formsText.addSongForm.submitText}</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const mapStoreToProps = (store) => {
    return { };
}

AddSongForm = Form.create()(AddSongForm);
export default connect(mapStoreToProps, { addSong })(AddSongForm);