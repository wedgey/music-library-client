import React from "react";
import { Col, Input, Row } from "antd";
import { connect } from "react-redux";

import { getSongs } from "../dataManager/songs";
import { loadSongs } from "../actions/libraryActions";
import { addSongToPlaylist } from "../actions/playlistActions";

import LibraryMusicTable from "../components/musicTable/library";

class Library extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            songs: [],
            totalCount: 0,
            searchTerm: ""
        }

        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentWillMount() {
        this.retrieveSongs();
    }

    handleTableChange(pagination, filters, sorter) {
        let { pageSize, current: currentPage } = pagination;
        this.retrieveSongs({ page: currentPage - 1, pageSize });
    }

    handleSearch(value) {
        this.retrieveSongs({ title: value });
    }

    retrieveSongs({id = null, title = null, page = 0, pageSize = 10} = {}) {
        getSongs({ title, page, pageSize })
            .then(({ songs, totalCount}) => {
                this.props.loadSongs(songs);
                this.setState({ songs: Object.values(songs), totalCount });
            })
            .catch(error => console.log(error));
    }

    render() {
        return (
            <div className="page-library">
                <Row>
                    <Col>
                        <Input.Search onSearch={this.handleSearch} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <LibraryMusicTable dataSource={Object.values(this.state.songs)} totalCount={this.state.totalCount} addSongToPlaylist={this.props.addSongToPlaylist} playlists={this.props.playlists} onChange={this.handleTableChange} />
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStoreToProps = (store) => {
    return {
        songs: store.library,
        playlists: store.playlists
    }
}

export default connect(mapStoreToProps, { loadSongs, addSongToPlaylist })(Library);