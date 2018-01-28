import React from "react";
import { Button, Tag } from "antd";
import PropTypes from "prop-types";

import MusicTable from "../musicTable";
import ClickInput from "../common/clickInput";
import ArtistComplete from "../artistComplete";
import LocalizationManager from "../../localization";
import YoutubePlayer from "../../utils/youtubeManager";
import { formatToMinutes } from "../../utils/common";
import { updateSongStatus, updateSongTitle, updateSongArtistsByName } from "../../dataManager/songs";
import { SongStatus } from "../../utils/enums";

class ManageSongsMusicTable extends React.Component {
    constructor(props) {
        super(props);

        this.stringObj = LocalizationManager.localization;

        this.columns = this.buildColumns();

        this.buildColumns = this.buildColumns.bind(this);
        this.approveSong = this.approveSong.bind(this);
        this.rejectSong = this.rejectSong.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleAddArtist = this.handleAddArtist.bind(this);
        this.handleRemoveArtist = this.handleRemoveArtist.bind(this);
        this.playSong = this.playSong.bind(this);
    }

    buildColumns() {
        return [{
            key: 'play-button',
            render: (text, row, index) => <Button shape="circle" icon="caret-right" onClick={this.playSong.bind(undefined, row)} />
        }, {
            title: this.stringObj.modelsText.music.title,
            dataIndex: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text, row, index) => <ClickInput confirmHandler={this.handleTitleChange.bind(undefined, row)} value={text}>{text}</ClickInput>
        }, {
            title: this.stringObj.modelsText.music.artist,
            dataIndex: 'artistNames',
            sorter: (a, b) => a.artistNames.localeCompare(b.artistNames),
            render: (text, row, index) => <ArtistComplete artist={row.artist.map(r => r.name)} removeArtist={this.handleRemoveArtist.bind(undefined, row)} addArtist={this.handleAddArtist.bind(undefined, row)} />,
        }, {
            title: this.stringObj.modelsText.music.duration,
            dataIndex: 'duration',
            render: (text, row, index) => text ? formatToMinutes(text) : "",
            sorter: (a, b) => (a.duration || 0) - (b.duration || 0)
        }, {
            title: this.stringObj.modelsText.music.youtubeTitle, 
            dataIndex: 'metaData.youtubeTitle', 
            render: (text, record, index) => <a target="_blank" href={`https://www.youtube.com/watch?v=${record.youtubeId}`}>{text}</a>
        }, {
            title: this.stringObj.modelsText.music.channelTitle, 
            dataIndex: 'metaData.channelTitle', 
            render: (text, record, index) => text
        }, { 
            title: this.stringObj.modelsText.music.status, 
            dataIndex: 'status', 
            render: (text, record, index) => <Tag color="orange">{record.status}</Tag>
        }, { 
            title: `${this.stringObj.componentsText.musicTable.manageSongs.approve}?`,
            dataIndex: 'status',
            key: 'approve-buttons',
            render: (text, record, index) => <React.Fragment><Button type="primary" data-origin="button" onClick={this.approveSong.bind(undefined, record)}>Approve</Button> <Button type="danger" data-origin="button" onClick={this.rejectSong.bind(undefined, record)}>Reject</Button></React.Fragment>
        }];
    }

    playSong(song) {
        let globalPlayer = YoutubePlayer.getGlobalPlayer();
        if (globalPlayer) globalPlayer.loadNewSong(song);
    }

    handleTitleChange(song, title) {
        return updateSongTitle(song.id, title.value)
                    .then(() => this.props.titleChangeCallback(song, title.value))
                    .catch(error => console.log(error));
    }

    handleAddArtist(song, artist) {
        let newArtists = song.artist.map(s => s.name);
        newArtists.push(artist.text);
        return updateSongArtistsByName(song.id, newArtists)
                    .then(s => this.props.artistChangeCallback(s))
                    .catch(error => console.log(error));
    }

    handleRemoveArtist(song, artistName) {
        let newArtists = song.artist.filter(s => s.name !== artistName).map(s => s.name);
        return updateSongArtistsByName(song.id, newArtists)
                    .then(s => this.props.artistChangeCallback(s))
                    .catch(error => console.log(error));
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
            <MusicTable className="table-manage-songs-music-table" {...rest} locale={{emptyText: 'No Pending Songs'}} dataSource={dataSource} totalCount={totalCount} columns={this.columns} />
        )
    }
}

ManageSongsMusicTable.propTypes = {
    approveSongCallback: PropTypes.func,
    rejectSongCallback: PropTypes.func,
    titleChangeCallback: PropTypes.func,
    artistChangeCallback: PropTypes.func
}

ManageSongsMusicTable.defaultProps = {
    approveSongCallback: () => {},
    rejectSongCallback: () => {},
    titleChangeCallback: () => {},
    artistChangeCallback: () => {}
}

export default ManageSongsMusicTable;