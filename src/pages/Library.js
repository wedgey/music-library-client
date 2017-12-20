import React from "react";
import { Col, Input, Row } from "antd";
import { connect } from "react-redux";

import { loadLibrary } from "../actions/libraryActions";
import { addSongToPlaylist } from "../actions/playlistActions";

import MusicTable from "../components/musicTable";

class Library extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            songs: [],
            searchTerm: ""
        }
    }

    componentWillMount() {
        this.props.loadLibrary();
    }

    componentDidMount() {
        if (this.state.songs !== this.props.songs) this.setState({ songs: this.props.songs });
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.songs !== nextProps.songs) this.setState({ songs: nextProps.songs });
    }

    // handleSearch(value) {
    //     if (searchTerm)
    // }

    render() {
        return (
            <div className="page-library">
                <Row>
                    <Col>
                        <Input.Search />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <MusicTable data={Object.values(this.state.songs)} addSongToPlaylist={this.props.addSongToPlaylist} playlists={this.props.playlists} />
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

export default connect(mapStoreToProps, { loadLibrary, addSongToPlaylist })(Library);