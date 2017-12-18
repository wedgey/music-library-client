import React from "react";
import { AutoComplete, Button, Card, Col, Form, Input, Row } from "antd";
import { connect } from "react-redux";

import LocalizationManager from "../../localization";
import { addSong } from "../../actions/libraryActions";
import youtubeManager from "../../utils/youtubeManager";
import { getArtists } from "../../dataManager/artists";

class AddSongForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            artists: []
        }

        this.player = null;
        this.stringObj = LocalizationManager.localization;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleYoutubeId = this.handleYoutubeId.bind(this);
        this.loadYoutubeVideo =  this.loadYoutubeVideo.bind(this);
        this.handleArtistsComplete = this.handleArtistsComplete.bind(this);
    }

    componentWillUnmount() {
        if (this.player) youtubeManager.destroyPlayer(this.player.id);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) this.props.addSong(values);
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
            let artists = response.data.artists;
            if (artists) artists = artists.map(artist => artist.name);
            this.setState({ artists })
        });
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
                                rules: [{ required: true, message: 'Please enter the title'}]
                            })(
                                <Input placeholder={this.stringObj.formsText.addSongForm.titlePlaceholder} />
                            )}
                        </Form.Item>
                        <Form.Item className="margin-bottom-sm indent-label" colon={false} label={this.stringObj.formsText.addSongForm.artistLabel}>
                            {getFieldDecorator('artist', {
                                rules: [{ required: true, message: 'Please enter the artist'}]
                            })(
                                <AutoComplete dataSource={this.state.artists} onSearch={this.handleArtistsComplete} placeholder={this.stringObj.formsText.addSongForm.artistPlaceholder} />
                                // <Input placeholder={this.stringObj.formsText.addSongForm.artistPlaceholder} />

                            )}
                        </Form.Item>
                        <Form.Item className="margin-bottom-sm indent-label" colon={false} label={this.stringObj.formsText.addSongForm.linkLabel}>
                            {getFieldDecorator('youtubeId', {
                                rules: [{ required: true, message: 'Please enter the youtube link'}],
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