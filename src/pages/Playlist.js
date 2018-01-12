import React from "react";
import { connect } from "react-redux";

import PlaylistMusicTable from "../components/musicTable/playlist";
import { YoutubePlayer } from "../utils/youtubeManager/playerModel";

class Playlist extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playlist: {},
            currentVideo: null
        }
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            let playlist = {...(this.props.playlists[this.props.match.params.id] || {})};
            if (playlist.songs && playlist.songs.length > 0) playlist.songs = playlist.songs.map(songId => this.props.songs[songId]);
            this.setState({ playlist });
        }
        if (this.props.playerManager.globalPlayerId !== null && this.props.player[this.props.playerManager.globalPlayerId]) {
            if (this.props.match.params.id === this.props.player[this.props.playerManager.globalPlayerId].playlist.id) this.setState({ currentVideo: this.props.player[this.props.playerManager.globalPlayerId].currentVideo });
            else this.setState({ currentVideo: null });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.playlist.id !== nextProps.match.params.id || this.props.playlists !== nextProps.playlists) {
            let playlist = {...(nextProps.playlists[nextProps.match.params.id] || {})};
            if (playlist.songs && playlist.songs.length > 0) playlist.songs = playlist.songs.map(songId => this.props.songs[songId]);
            this.setState({playlist});
        }
        if (nextProps.playerManager.globalPlayerId !== null && nextProps.player[nextProps.playerManager.globalPlayerId]) {
            if (nextProps.match.params.id === nextProps.player[nextProps.playerManager.globalPlayerId].playlist.id) this.setState({ currentVideo: nextProps.player[nextProps.playerManager.globalPlayerId].currentVideo });
            else this.setState({ currentVideo: null });
        }
    }

    render() {
        return (
            <div className="page-playlist">
                {this.state.playlist.name}
                <PlaylistMusicTable playlist={this.state.playlist} currentVideo={this.state.currentVideo} />
            </div>
        )
    }
}

const mapStoreToProps = (store) => {
    return {
        songs: store.library,
        playlists: store.playlists,
        playerManager: store.playerManager,
        player: store.players
    }
}

export default connect(mapStoreToProps, {})(Playlist);