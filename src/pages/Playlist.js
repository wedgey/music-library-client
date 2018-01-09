import React from "react";
import { connect } from "react-redux";

import PlaylistMusicTable from "../components/musicTable/playlist";

class Playlist extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playlist: {}
        }
    }

    componentDidMount() {
        let playlist = {...(this.props.playlists[this.props.match.params.id] || {})};
        if (this.props.match.params.id) {
            if (playlist.songs && playlist.songs.length > 0) playlist.songs = playlist.songs.map(songId => this.props.songs[songId]);
            this.setState({playlist});
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.playlist.id !== nextProps.match.params.id || this.props.playlists !== nextProps.playlists) {
            let playlist = {...(nextProps.playlists[nextProps.match.params.id] || {})};
            if (playlist.songs && playlist.songs.length > 0) playlist.songs = playlist.songs.map(songId => this.props.songs[songId]);
            this.setState({playlist});
        }
    }

    render() {
        // let currentVideo = this.props.globalPlayer.playlist.id === this.state.playlist.id ? this.props.globalPlayer.currentVideo : null;
        let currentVideo = null;
        return (
            <div className="page-playlist">
                {this.state.playlist.name}
                <PlaylistMusicTable playlist={this.state.playlist} currentVideo={currentVideo} />
            </div>
        )
    }
}

const mapStoreToProps = (store) => {
    return {
        songs: store.library,
        playlists: store.playlists,
        globalPlayer: store.globalPlayer
    }
}

export default connect(mapStoreToProps, {})(Playlist);