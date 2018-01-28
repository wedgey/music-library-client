import React from "react";
import { Button, Col, Input, Row } from "antd";

import { getChannels, addChannel, syncChannel } from "../../dataManager/channels";
import ManageChannelsTable from "../../components/admin/manageChannelsTable";

class AdminManageChannels extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addChannelUsername: "",
            loading: false,
            channels: []
        }

        this.retrieveChannels = this.retrieveChannels.bind(this);
        this.handleAddChannel = this.handleAddChannel.bind(this);
        this.handleAddChannelChange = this.handleAddChannelChange.bind(this);
        this.handleSyncChannel = this.handleSyncChannel.bind(this);
    }

    componentWillMount() {
        this.retrieveChannels();
    }

    handleAddChannelChange(e) {
        this.setState({ addChannelUsername: e.target.value });
    }

    handleAddChannel(e) {
        let channelUsername = this.state.addChannelUsername;
        if (!channelUsername) return;
        addChannel({ youtubeUsername: channelUsername })
            .then(channel => {
                this.setState({ addChannelUsername: "" });
                this.retrieveChannels();
            })
            .catch(error => console.log(error));
    }

    handleSyncChannel(channel) {
        syncChannel({id: channel.id});
    }

    retrieveChannels() {
        this.setState({ loading: true });
        getChannels()
            .then(channels => {
                this.setState({ loading: false, channels: Object.values(channels) });
            })
            .catch(error => { this.setState({ loading: false }); });
    }

    render() {
        return (
            <div className="page-admin-manage-channels">
                <Row type="flex">
                    <Col className="auto">
                        <Input onChange={this.handleAddChannelChange} onPressEnter={this.handleAddChannel} />
                    </Col>
                    <Col>
                        <Button type="primary" icon="plus" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ManageChannelsTable channels={this.state.channels} handleSyncChannel={this.handleSyncChannel} />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default AdminManageChannels;