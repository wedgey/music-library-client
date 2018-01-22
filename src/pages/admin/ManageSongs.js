import React from "react";
import { Col, Input, Row } from "antd";

import { getPendingSongs } from "../../dataManager/songs";
import { loadSongs } from "../../actions/libraryActions";

import ManageSongsMusicTable from "../../components/admin/manageSongsTable";

class AdminManageSongs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            songs: [],
            totalCount: 0,
            loading: false
        }

        this.approveSongCallback = this.approveSongCallback.bind(this);
        this.rejectSongCallback = this.rejectSongCallback.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }
    
    componentWillMount() {
        this.retrievePendingSongs();
    }

    approveSongCallback(song) {
        loadSongs({ [song.id]: song });
        this.setState({ songs: this.state.songs.filter(s => s.id !== song.id)});
    }

    rejectSongCallback(song) {
        this.setState({ songs: this.state.songs.filter(s => s.id !== song.id)});
    }

    handleTableChange(pagination, filters, sorter) {
        let { pageSize, current: currentPage } = pagination;
        this.retrievePendingSongs({ page: currentPage - 1, pageSize });
    }

    handleSearch(value) {
        this.retrievePendingSongs({ title: value });
    }

    retrievePendingSongs({ id= null, title = null, page = 0, pageSize = 10} = {}) {
        this.setState({ loading: true });
        getPendingSongs({ title, page, pageSize })
            .then(({ songs, totalCount }) => {
                this.setState({ loading: false, songs: Object.values(songs), totalCount });
            })
            .catch(error => { this.setState({ loading: false }); console.log(error)});
    }

    render() {
        return (
            <div className="page-admin-manage-songs">
                <Row>
                    <Col>
                        <Input.Search onSearch={this.handleSearch} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ManageSongsMusicTable dataSource={Object.values(this.state.songs)} loading={{spinning: this.state.loading, delay: 200}} totalCount={this.state.totalCount} onChange={this.handleTableChange} approveSongCallback={this.approveSongCallback} rejectSongCallback={this.rejectSongCallback} />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default AdminManageSongs;