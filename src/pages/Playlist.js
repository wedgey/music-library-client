import React from "react";
import { connect } from "react-redux";

import PlaylistTable from "../components/musicTable/playlist";

class Playlist extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playlist: {}
        }
    }

    componentDidMount() {
        let playlist = this.props.playlists[this.props.match.params.id] || {};
        if (this.props.match.params.id) this.setState({playlist});
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.playlist.id !== nextProps.match.params.id) {
            let playlist = nextProps.playlists[nextProps.match.params.id] || {};
            this.setState({playlist});
        }
    }

    render() {
        return (
            <div className="page-playlist">
                {this.state.playlist.name}
                <PlaylistTable playlist={this.state.playlist} currentVideo={this.props.globalPlayer.playlist.id === this.state.playlist.id ? this.props.globalPlayer.currentVideo : null} />
            </div>
        )
    }
}

const mapStoreToProps = (store) => {
    return {
        playlists: store.playlists,
        globalPlayer: store.globalPlayer
    }
}

export default connect(mapStoreToProps, {})(Playlist);