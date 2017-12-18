import React from "react";
import { Col, Row } from "antd";

import AddSongForm from "../components/forms/addSongForm";

class AddSong extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="page-add-song">
                <AddSongForm />
            </div>
        )
    }
}

export default AddSong;