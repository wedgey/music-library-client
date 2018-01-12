import React from "react";
import { connect } from "react-redux";

import youtubeManager from "../../utils/youtubeManager";
import { updatePlayerState } from "../../actions/playersActions";

class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
            isReady: false,
        }

        this.youtubePlayerElement = null;
        this.player = null;

        this.handlePlayerReady = this.handlePlayerReady.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        
        this.playVideo = this.playVideo.bind(this);
    }

    componentDidMount() {
        if (!this.state.id) {
            youtubeManager.createYoutubePlayer(this.youtubePlayerElement, {}).then((id) => this.setState({id}));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.players[this.state.id] !== this.props.players[this.state.id]) {
            
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.id !== nextState.id) {
            this.player = youtubeManager.getPlayer(nextState.id);
            this.player.addEventListener('onReady', this.handlePlayerReady);
            this.player.addEventListener('onStateChange', this.handleStateChange);
        }
        return true;
    }

    handlePlayerReady(e) {
        this.setState({ isReady: true });
    }

    handleStateChange(e) {
        this.props.updatePlayerState(this.state.id, e.data);
    }

    // PLAYER CONTROLS
    playVideo() {
        this.player.playVideo();
    }

    render() {
        return (
            <div className="cmpt-player">
                <div className="video-overlay"></div>
                <div style={{width: '92px', height: '36px'}} ref={r => { this.youtubePlayerElement = r }}></div>
            </div>
        )
    }
}

const mapStoreToProps = (store) => {
    return {
        players: store.player
    }
}

const mapDispatchToProps = {
    updatePlayerState
}

export default connect(mapStoreToProps, mapDispatchToProps, null, { withRef: true })(Player);