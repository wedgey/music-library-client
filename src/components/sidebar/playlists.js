import React from "react";
import { Dropdown, Menu, Popconfirm } from "antd";
import { Link } from "react-router-dom";

import LocalizationManager from "../../localization";

class SideBarPlaylists extends React.Component {
    constructor(props) {
        super(props);

        this.stringObj = LocalizationManager.localization;
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
                            <div>{playlist.name} {this.props.globalPlayer.playlist.id === playlist.id && <Icon type='sound' />}</div>
                        </Link>
                    </Dropdown>
                </Menu.Item>
            )
        });

        return (
            <Menu mode="inline" theme="dark" selectedKeys={this.props.selectedKeys || []}>
                <Menu.ItemGroup key={this.stringObj.componentsText.sideBarText.headers.playlist} title={this.stringObj.componentsText.sideBarText.headers.playlist}>
                    <Menu.Item key="create-playlist">
                        <Link to="/">
                            <div></div>
                        </Link>
                    </Menu.Item>
                    {playlists}
                </Menu.ItemGroup>
            </Menu>
        )
    }
}

export default SideBarPlaylists;