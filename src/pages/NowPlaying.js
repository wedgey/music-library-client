import React from "react";
import { connect } from "react-redux";

import { createPlaylist } from "../actions/playlistActions";
import PlaylistMusicTable from "../components/musicTable/playlist";
import YoutubeManager from "../utils/youtubeManager";

class NowPlaying extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentVideo: null,
            playlist: { songs: [] }
        }
    }

    componentDidMount() {
        if (this.props.playerManager.globalPlayerId !== null && this.props.players[this.props.playerManager.globalPlayerId]) {
            let playerStore = this.props.players[this.props.playerManager.globalPlayerId];
            let playlist = { ...playerStore.playlist } || {};
            if (playlist.songs && playlist.songs.length > 0) playlist.songs = playlist.songs.map(songId => this.props.songs[songId]);
            this.setState({ currentVideo: playerStore.currentVideo, playlist: playlist});
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.playerManager.globalPlayerId !== nextProps.playerManager.globalPlayerId || this.props.players[this.props.playerManager.globalPlayerId] !== nextProps.players[nextProps.playerManager.globalPlayerId]) {
            let playerStore = nextProps.players[nextProps.playerManager.globalPlayerId];
            let playlist = { ...playerStore.playlist } || {};
            if (playlist.songs && playlist.songs.length > 0) playlist.songs = playlist.songs.map(songId => nextProps.songs[songId]);
            this.setState({ currentVideo: playerStore.currentVideo, playlist: playlist});
        }
    }

    render() {
        return (
            <div className="page-now-playing">
                <PlaylistMusicTable playlist={this.state.playlist} currentVideo={this.state.currentVideo} showOptions={false} />
            </div>
        )
    }
}

const mapStoreToProps = (store) => {
    return {
        songs: store.library,
        players: store.players,
        playerManager: store.playerManager
    }
}

export default connect(mapStoreToProps, { createPlaylist })(NowPlaying);