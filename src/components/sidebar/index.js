import React from "react";
import { connect } from "react-redux";
import { Dropdown, Icon, Menu, Popconfirm } from "antd";
import { Link } from "react-router-dom";

import SideBarUserInfo from "./userInfo";
import ClickInput from "../common/clickInput";

import LocalizationManager from "../../localization";
import { getPlaylists, deletePlaylist, createPlaylist } from "../../actions/playlistActions";

class SideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isCreatePlaylistActive: false
        }

        this.stringObj = LocalizationManager.localization;
        props.getPlaylists();

        this.handleCreatePlaylist = this.handleCreatePlaylist.bind(this);
    }

    handleCreatePlaylist({value}) {
        this.props.createPlaylist({name: value});
    }

    render() {
        let playlists = Object.entries(this.props.playlists).map(playlist => {
            playlist = playlist[1];
            let contextMenu = (
                <Menu>
                    <Menu.Item key="delete">
                        <Popconfirm title={this.stringObj.commonText.confirmQuestion} onConfirm={this.props.deletePlaylist.bind(undefined, {id: playlist.id})} okText={this.stringObj.commonText.yes} cancelText={this.stringObj.commonText.no} placement="right">
                            <a onClick={(e) => e.stopPropagation()}>{this.stringObj.commonText.delete}</a>
                        </Popconfirm>
                    </Menu.Item>
                </Menu>
            );
            return (
                <Menu.Item key={playlist.id}>
                    <Dropdown overlay={contextMenu} trigger={['contextMenu']}>
                        <Link to={`/playlist/${playlist.id}`}>
                            <div><Icon type="file-text" /> {playlist.name} {this.props.globalPlayer.playlist.id === playlist.id && <Icon type='sound' />}</div>
                        </Link>
                    </Dropdown>
                </Menu.Item>
            )
        });

        return (
            <div className='cmpt-side-bar'>
                {/* <SideBarUserInfo user={this.props.user} isSideBarOpen={this.props.ui.isSideBarOpen} /> */}
                <Menu mode="inline" theme="dark">
                    <Menu.ItemGroup key={this.stringObj.componentsText.sideBarText.headers.music} title={this.stringObj.componentsText.sideBarText.headers.music}>
                        <Menu.Item key={this.stringObj.componentsText.sideBarText.linkText.library}>
                            <Link to="/library">
                                <Icon type='database' />
                                <span>{this.stringObj.componentsText.sideBarText.linkText.library}</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key={this.stringObj.componentsText.sideBarText.linkText.nowPlaying}>
                            <Link to="/nowplaying">
                                <Icon type='caret-right' />
                                <span>{this.stringObj.componentsText.sideBarText.linkText.nowPlaying}</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key={this.stringObj.componentsText.sideBarText.linkText.addSong}>
                            <Link to="/addsong">
                                <Icon type='plus' />
                                <span>{this.stringObj.componentsText.sideBarText.linkText.addSong}</span>
                            </Link>
                        </Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup key={this.stringObj.componentsText.sideBarText.headers.playlist} title={this.stringObj.componentsText.sideBarText.headers.playlist}>
                        <Menu.Item key="create-playlist">
                            {/* <CreatePlaylistOption createPlaylist={this.props.createPlaylist} /> */}
                            <ClickInput confirmHandler={this.handleCreatePlaylist} confirmOnBlur><Icon type="file-add" /> Create Playlist</ClickInput>
                        </Menu.Item>
                        {playlists}
                    </Menu.ItemGroup>
                </Menu>
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        ui: store.ui,
        user: store.user,
        playlists: store.playlists,
        globalPlayer: store.globalPlayer
    }
}

export default connect(mapStateToProps, { getPlaylists, deletePlaylist, createPlaylist })(SideBar);