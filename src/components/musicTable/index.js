import React from "react";
import { Button, Table } from "antd";

import { formatToMinutes } from "../../utils/common";
import LocalizationManager from "../../localization";
import YoutubeManager from "../../utils/youtubeManager";
import NotificationManager from "../../utils/notificationManager";

import LibrarySongOptions from "./librarySongOptions";

class MusicTable extends React.Component {
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
        return { index, onClick: this.handleRowClick.bind(undefined, record), className: "clickable"}
    }

    handleRowClick(record, event) {
        if (event.target.dataset.origin === "dropdown-item") return;
        this.playSong(record);
    }

    playSong(song) {
        let globalPlayer = YoutubeManager.getGlobalPlayer();
        if (globalPlayer) globalPlayer.loadNewSong(song);
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
            render: (text, row, index) => text ? formatToMinutes(text) : "",
            sorter: (a, b) => (a.duration || 0) - (b.duration || 0)
        }];
    }

    render() {
        let data = this.props.data || [];
        let { columns, pageSize } = this.state;
        columns = [...columns, { render: (text, record, index) => <LibrarySongOptions song={record} playlists={this.props.playlists} addSongToPlaylist={this.props.addSongToPlaylist} />, width: 1}];
        return (
            <Table className="table-music-table" columns={columns} dataSource={data} rowKey={record => record.id} onRow={this.rowPropSetup} pagination={data.length > pageSize && { pageSize }} />
        )
    }
}

export default MusicTable;