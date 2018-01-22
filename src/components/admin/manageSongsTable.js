import React from "react";
import { Button, Tag } from "antd";
import PropTypes from "prop-types";

import MusicTable from "../musicTable";
import ClickInput from "../common/clickInput";
import LocalizationManager from "../../localization";
import YoutubePlayer from "../../utils/youtubeManager";
import { formatToMinutes } from "../../utils/common";
import { updateSongStatus } from "../../dataManager/songs";
import { SongStatus } from "../../utils/enums";

class ManageSongsMusicTable extends React.Component {
    constructor(props) {
        super(props);

        this.stringObj = LocalizationManager.localization;

        this.columns = this.buildColumns();

        this.buildColumns = this.buildColumns.bind(this);
        this.approveSong = this.approveSong.bind(this);
        this.rejectSong = this.rejectSong.bind(this);
        this.playSong = this.playSong.bind(this);
    }

    buildColumns() {
        return [{
            key: 'play-button',
            render: (text, row, index) => <Button shape="circle" icon="caret-right" onClick={this.playSong.bind(undefined, row)} />
        },{
            title: this.stringObj.modelsText.music.title,
            dataIndex: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text, row, index) => <ClickInput confirmHandler={this.handleTitleChange.bind(undefined, row)} value={text}>{text}</ClickInput>
        },{
            title: this.stringObj.modelsText.music.artist,
            dataIndex: 'artistNames',
            sorter: (a, b) => a.artistNames.localeCompare(b.artistNames),
            render: (text, row, index) => <ClickInput confirmHandler={this.handleArtistChange.bind(undefined, row)} value={text}>{text}</ClickInput>
        },{
            title: this.stringObj.modelsText.music.duration,
            dataIndex: 'duration',
            render: (text, row, index) => text ? formatToMinutes(text) : "",
            sorter: (a, b) => (a.duration || 0) - (b.duration || 0)
        }, { 
            title: this.stringObj.modelsText.music.status, 
            dataIndex: 'status', 
            render: (text, record, index) => <Tag color="orange">{record.status}</Tag>
        }, { 
            title: `${this.stringObj.componentsText.musicTable.manageSongs.approve}?`,
            dataIndex: 'status',
            key: 'approve-buttons',
            render: (text, record, index) =>  <React.Fragment><Button type="primary" data-origin="button" onClick={this.approveSong.bind(undefined, record)}>Approve</Button>&nbsp;<Button type="danger" data-origin="button" onClick={this.rejectSong.bind(undefined, record)}>Reject</Button></React.Fragment>
        }];
    }

    playSong(song) {
        let globalPlayer = YoutubePlayer.getGlobalPlayer();
        if (globalPlayer) globalPlayer.loadNewSong(song);
    }

    handleTitleChange() {

    }

    handleArtistChange() {

    }

    approveSong(song) {
        return updateSongStatus(song.id, SongStatus.active)
                    .then(() => this.props.approveSongCallback(song))
                    .catch();
    }

    rejectSong(song) {
        return updateSongStatus(song.id, SongStatus.deleted)
                    .then(() => this.props.rejectSongCallback(song))
                    .catch();
    }

    render() {
        let { dataSource, totalCount, ...rest } = this.props;
        return (
            <MusicTable className="table-manage-songs-music-table" dataSource={dataSource} totalCount={totalCount} columns={this.columns} />
        )
    }
}

ManageSongsMusicTable.propTypes = {
    approveSongCallback: PropTypes.func,
    rejectSongCallback: PropTypes.func
}

ManageSongsMusicTable.defaultProps = {
    approveSongCallback: () => {},
    rejectSongCallback: () => {}
}

export default ManageSongsMusicTable;