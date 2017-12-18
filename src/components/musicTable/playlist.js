import React from "react";
import { Button, Table } from "antd";

import Dropdown from "../common/dropdown";

import LocalizationManager from "../../localization";
import YoutubeManager from "../../utils/youtubeManager";
import NotificationManager from "../../utils/notificationManager";

class PlaylistTable extends React.Component {
    constructor(props) {
        super(props);

        this.stringObj = LocalizationManager.localization;
        this.state = {
            columns: this.buildColumns(),
            pageSize: 10
        };

        this.rowPropSetup = this.rowPropSetup.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.playSong = this.playSong.bind(this);
    }

    rowPropSetup(record, index) {
        let props = { index, onClick: this.handleRowClick.bind(undefined, record, index), className: "clickable"};
        if (index === this.props.currentVideo) props.className += " active";
        return props;
    }

    handleRowClick(record, index, event) {
        if (event.target.dataset.origin === "dropdown-item") return;
        this.playSong(record, index);
    }

    playSong(song, index) {
        let globalPlayer = YoutubeManager.getGlobalPlayer();
        if (globalPlayer) {
            if (globalPlayer.playlist.id === this.props.playlist.id) globalPlayer.playSongAt(index);
            else globalPlayer.loadPlaylistAndPlay(this.props.playlist, index);
        }
    }

    buildColumns() {
        return [{
            title: this.stringObj.modelsText.music.title,
            dataIndex: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title)
        },{
            title: this.stringObj.modelsText.music.artist,
            dataIndex: 'artist.name',
            sorter: (a, b) => a.artist.name.localeCompare(b.artist.name)
        },{
            title: this.stringObj.modelsText.music.duration,
            dataIndex: 'duration',
            sorter: (a, b) => a.duration - b.duration
        }];
    }

    render() {
        let data = this.props.playlist.songs || [];
        let { pageSize } = this.state;
        return (
            <Table className="table-playlist-table" columns={this.state.columns} dataSource={data} rowKey={(record, idx) => idx} onRow={this.rowPropSetup} pagination={data.length > pageSize && { pageSize }} />
        )
    }
}

export default PlaylistTable;