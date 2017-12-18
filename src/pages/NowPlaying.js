import React from "react";
import { connect } from "react-redux";
import { Button } from "antd";

import { createPlaylist } from "../actions/playlistActions";
import PlaylistTable from "../components/musicTable/playlist";
import YoutubeManager from "../utils/youtubeManager";

class NowPlaying extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            globalPlayer: null,
            playlist: { songs: [] }
        }
    }

    componentDidMount() {
        if (this.props.globalPlayer.player !== null) {
            this.setState({ globalPlayer: YoutubeManager.getGlobalPlayer(), playlist: this.props.globalPlayer.playlist });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.globalPlayer === null && this.props.globalPlayer.player !== null) {
            this.setState({ globalPlayer: YoutubeManager.getGlobalPlayer(), playlist: this.props.globalPlayer.playlist }, () => console.log(this.state));
        }
    }

    render() {
        return (
            <div className="page-now-playing">
                <PlaylistTable playlist={this.state.playlist} currentVideo={this.props.globalPlayer.currentVideo} />
            </div>
        )
    }
}

const mapStoreToProps = (store) => {
    return {
        globalPlayer: store.globalPlayer
    }
}

export default connect(mapStoreToProps, { createPlaylist })(NowPlaying);