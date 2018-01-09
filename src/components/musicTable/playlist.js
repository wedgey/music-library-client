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

        this.state = {
            currentPage: 1,
            pageSize: 10
        }

        this.rowPropSetup = this.rowPropSetup.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.playSong = this.playSong.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.playerManager.globalPlayerId);
        if (this.props.playlist !== nextProps.playlist && nextProps.playerManager.globalPlayerId) {
            let currentGlobalPlayer = YoutubeManager.getGlobalPlayer();
            console.log(currentGlobalPlayer);
            let currentGlobalPlaylist = currentGlobalPlayer ? currentGlobalPlayer.getCurrentPlaylist() : {};
            let currentPage = 1;
            if (currentGlobalPlaylist.id === nextProps.playlist.id && currentGlobalPlayer) currentPage = (Math.floor(currentGlobalPlayer.currentVideo / this.state.pageSize)) + 1;
            this.setState({ currentPage });
        }
    }

    rowPropSetup(record, index) {
        let props = { index, onClick: this.handleRowClick.bind(undefined, record, index), className: "clickable"};
        if ((index + ((this.state.currentPage - 1) * this.state.pageSize)) === this.props.currentVideo) props.className += " active";
        return props;
    }

    handleRowClick(record, index, event) {
        if (event.target.dataset.origin === "dropdown-item") return;
        this.playSong(record, index);
    }

    playSong(song, index) {
        let globalPlayer = YoutubeManager.getPlayer(this.props.playerManager.globalPlayerId);
        let playlist = globalPlayer.getCurrentPlaylist();
        if (globalPlayer) {
            let playlistIndex = index + ((this.state.currentPage - 1) * this.state.pageSize)
            if (playlist.id === this.props.playlist.id) globalPlayer.playSongAt(playlistIndex);
            else globalPlayer.loadPlaylistAndPlay(this.props.playlist, playlistIndex);
        }
    }

    handlePageChange(page) {
        this.setState({ currentPage: page });
    }

    render() {
        let dataSource = (this.props.playlist.songs || []).map(song => (this.props.songs[song] || song));
        let additionalColumns = this.props.showOptions ? [{ render: (text, record, index) => <PlaylistSongOptions song={record} playlist={this.props.playlist} removeSongFromPlaylist={this.props.removeSongFromPlaylist} />, width: 1}] : [];

        let totalCount = dataSource.length;
        let pageSize = this.state.pageSize;
        let pagination = totalCount > pageSize && { pageSize, total: totalCount, current: this.state.currentPage, onChange: this.handlePageChange };
        this.props.currentVideo;
        return (
            <MusicTable className="table-playlist-music-table" dataSource={dataSource} totalCount={dataSource.length} additionalColumns={additionalColumns} onRow={this.rowPropSetup} pageSize={pageSize} pagination={pagination} />
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
        songs: store.library,
        playerManager: store.playerManager
    }
}

export default connect(mapStoreToProps, { removeSongFromPlaylist })(PlaylistMusicTable);