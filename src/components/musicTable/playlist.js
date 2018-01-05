import React from "react";
import { Button, Table } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import MusicTable from "./index";
import LocalizationManager from "../../localization";
import YoutubeManager from "../../utils/youtubeManager";
import { removeSongFromPlaylist } from "../../actions/playlistActions";

import PlaylistSongOptions from "./playlistSongOptions";

class PlaylistMusicTable extends React.Component {
    constructor(props) {
        super(props);

        this.stringObj = LocalizationManager.localization;

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

    render() {
        let dataSource = (this.props.playlist.songs || []).map(song => (this.props.songs[song] || song));
        let additionalColumns = this.props.showOptions ? [{ render: (text, record, index) => <PlaylistSongOptions song={record} playlist={this.props.playlist} removeSongFromPlaylist={this.props.removeSongFromPlaylist} />, width: 1}] : [];
        return (
            <MusicTable className="table-playlist-music-table" dataSource={dataSource} totalCount={dataSource.length} additionalColumns={additionalColumns} onRow={this.rowPropSetup} />
        )
    }
}

PlaylistMusicTable.propTypes = {
    showOptions: PropTypes.bool
}

PlaylistMusicTable.defaultProps = {
    showOptions: true
}

const mapStoreToProps = (store) => {
    return {
        songs: store.library
    }
}

export default connect(mapStoreToProps, { removeSongFromPlaylist })(PlaylistMusicTable);