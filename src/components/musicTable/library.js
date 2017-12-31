import React from "react";
import { Button } from "antd";

import MusicTable from "./index";
import LocalizationManager from "../../localization";
import YoutubeManager from "../../utils/youtubeManager";

import LibrarySongOptions from "./librarySongOptions";

class LibraryMusicTable extends React.Component {
    constructor(props) {
        super(props);

        this.stringObj = LocalizationManager.localization;

        this.rowPropSetup = this.rowPropSetup.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.playSong = this.playSong.bind(this);
    }

    rowPropSetup(record, index) {
        return { index, onClick: this.handleRowClick.bind(undefined, record), className: "clickable"}
    }

    handleRowClick(record, event) {
        if (event.target.dataset.origin === "dropdown-item") return;
        this.playSong(record);
    }

    playSong(song) {
        let globalPlayer = YoutubeManager.getGlobalPlayer();
        if (globalPlayer) globalPlayer.loadNewSong(song);
    }

    render() {
        let { addSongToPlaylist, dataSource, playlists, totalCount, ...rest } = this.props;
        let additionalColumns = [{ render: (text, record, index) => <LibrarySongOptions song={record} playlists={playlists} addSongToPlaylist={addSongToPlaylist} />, width: 1}];
        return (
            <MusicTable className="table-library-music-table" {...rest} dataSource={dataSource} totalCount={totalCount} additionalColumns={additionalColumns} onRow={this.rowPropSetup} />
        )
    }
}

export default LibraryMusicTable;