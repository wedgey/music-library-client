import React from "react";
import { AutoComplete } from "antd";
import PropTypes from "prop-types";

import LocalizationManager from "../../localization";
import TagInput from "../forms/tagInput";
import { getArtists } from "../../dataManager/artists";

class ArtistComplete extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            artistsAutoComplete: [],
            artistInputValue: ""
        }

        this.artistSelectedEvent = false;
        this.stringObj = LocalizationManager.localization;
        this.handleArtistsComplete = this.handleArtistsComplete.bind(this);
        this.handleArtistSelect = this.handleArtistSelect.bind(this);
        this.handleTagClose = this.handleTagClose.bind(this);
        this.onArtistInputChange = this.onArtistInputChange.bind(this);
    }

    handleTagClose(tag) {
        this.props.removeArtist(tag);
    }

    handleArtistsComplete(name = "") {
        getArtists({ name })
            .then(artists => this.setState({ artistsAutoComplete: artists.map((artist, idx) => { return { value: idx, text: artist.name }}) }))
            .catch(error => () => {})
    }

    handleArtistSelect(value, option) {
        let artist = this.state.artistsAutoComplete[value];
        this.props.addArtist(artist);
        this.artistSelectedEvent = true;
        this.setState({ artistInputValue: "" });
    }

    onArtistInputChange(value, label) {
        if (this.artistSelectedEvent) {
            this.setState({ artistInputValue: "" });
            this.artistSelectedEvent = false;
        } else {
            if (value.slice(-1) === ",") {
                let newArtistName = value.substr(0, value.length - 1);
                let newArtist = { text: newArtistName, value: null };
                this.props.addArtist(newArtist);
            } else {
                this.setState({ artistInputValue: value });
            }
        }
    }

    render() {
        return (
            <TagInput tags={this.props.artist} tagProps={{closable: true, onClose: this.handleTagClose}}>
                <AutoComplete dataSource={this.state.artistsAutoComplete} onSearch={this.handleArtistsComplete} onSelect={this.handleArtistSelect} value={this.state.artistInputValue} onChange={this.onArtistInputChange} placeholder={this.stringObj.formsText.addSongForm.artistPlaceholder} />
            </TagInput>
        )
    }
}

ArtistComplete.propTypes = {
    removeArtist: PropTypes.func,
    addArtist: PropTypes.func,
    artist: PropTypes.array
}

ArtistComplete.defaultProps = {
    removeArtist: () => {},
    addArtist: () => {},
    artist: []
}

export default ArtistComplete;