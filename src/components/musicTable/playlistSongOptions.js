import React from "react";
import { Button, Menu } from "antd";
import PropTypes from "prop-types";

import Dropdown from "../common/dropdown";
import YoutubeManager from "../../utils/youtubeManager";

class PlaylistSongOptions extends React.Component {
    constructor(props) {
        super(props);      
    }

    removeFromPlaylist(song) {
        this.props.removeSongFromPlaylist({id: this.props.playlist.id, song});
    }

    render() {
        let options = [
            <Menu.Item key="remove-song"><a data-origin="dropdown-item" onClick={this.removeFromPlaylist.bind(this, this.props.song)}>Remove Song</a></Menu.Item>
        ];
        return (
            <div className="cmpt-playlist-song-options">
                <Dropdown options={options}><Button icon='ellipsis' data-origin="dropdown-item" /></Dropdown>
            </div>
        )
    }
}

PlaylistSongOptions.propTypes = {
    playlist: PropTypes.object,
    song: PropTypes.object,
    removeSongFromPlaylist: PropTypes.func
}

export default PlaylistSongOptions;