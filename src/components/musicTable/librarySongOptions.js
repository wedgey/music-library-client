import React from "react";
import { Button, Menu } from "antd";

import Dropdown from "../common/dropdown";
import YoutubeManager from "../../utils/youtubeManager";
import NotificationManager from "../../utils/notificationManager";

class LibrarySongOptions extends React.Component {
    constructor(props) {
        super(props);

        this.addToPlaylist =this.addToPlaylist.bind(this);
    }

    queueSong(song, event) {
        let globalPlayer = YoutubeManager.getGlobalPlayer();
        if (globalPlayer) { 
            globalPlayer.queueVideoBySong(song);
            NotificationManager.showSuccessNotification({ type: NotificationManager.NotificationTypes.Player, message: 'Song Queued', description: (<span><strong>{song.title}</strong> has been queued.</span>)});
        }
    }

    addToPlaylist(id, song, event) {
        if (this.props.addSongToPlaylist) this.props.addSongToPlaylist({ id, song });
    }

    render() {
        let playlistOptions = Object.entries(this.props.playlists).map((playlist) => <Menu.Item key={playlist[0]}><a data-origin="dropdown-item" onClick={this.addToPlaylist.bind(undefined, playlist[0], this.props.song)}>{playlist[1].name}</a></Menu.Item>);
        let playlistSubmenu = <Menu.SubMenu key="add-to-playlist" title="Add to Playlist" children={playlistOptions}></Menu.SubMenu>
        let options = [<Menu.Item key="queue-song"><a data-origin="dropdown-item" onClick={this.queueSong.bind(undefined, this.props.song)}>Queue Song</a></Menu.Item>, playlistSubmenu];
        return (
            <div className="cmpt-library-song-options">
                <Dropdown options={options}><Button icon='ellipsis' data-origin="dropdown-item" /></Dropdown>
            </div>
        )
    }
}

export default LibrarySongOptions;