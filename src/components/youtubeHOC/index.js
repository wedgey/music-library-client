import React from "react";
import { connect } from "react-redux";

import YoutubeManager from "../../utils/youtubeManager";
import { YTPlayerRepeat, YTPlayerState } from "../../utils/enums";

const youtubeConnect = (WrappedComponent) => {
    class YoutubeConnect extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                id: null,
                youtubePlayer: null,
                timePollIntervalId: null,
                playerCurrentTime: 0,
                playerVideoDuration: 0
            }

            this.createYoutubePlayer = this.createYoutubePlayer.bind(this);
            this.updatePlayerTime = this.updatePlayerTime.bind(this);
        }

        componentWillReceiveProps(nextProps) {
            if (this.props.players !== nextProps.players) {
                if (this.state.id && this.state.youtubePlayer === null) {
                    if (nextProps.players[this.state.id] && nextProps.players[this.state.id].isReady) {
                        this.setState({ youtubePlayer: youtubeManager.getPlayer(this.state.id) });
                    }
                }
                if (nextProps.players[this.state.id] && this.props.players[this.state.id].playerState !== nextProps.players[this.state.id].playerState) {
                    this.handlePlayerStateChange(nextProps.players[this.state.id].playerState);
                }
            }
        }

        componentWillUnmount() {
            clearInterval(this.state.timePollIntervalId);
        }

        createYoutubePlayer(element, options, isGlobal) {
            let id = YoutubeManager.createYoutubePlayer(element, options, isGlobal);
            this.setState({ id });
        }

        updatePlayerTime() {
            let currentTime = this.state.youtubePlayer.getCurrentTime();
            let duration = this.state.youtubePlayer.getDuration();
            this.setState({ playerVideoDuration: duration, playerCurrentTime: currentTime });
        }

        handlePlayerStateChange(playerState) {
            let timePollIntervalId = this.state.timePollIntervalId;
            switch(playerState) {
                case YTPlayerState.playing: {
                    if (timePollIntervalId) clearInterval(timePollIntervalId);
                    let pollId = window.setInterval(this.updatePlayerTime, 100);
                    this.setState({ timePollIntervalId: pollId });
                    break;
                }
                case YTPlayerState.ended: {
                    this.setState({ playerCurrentTime: 0 });
                    if (timePollIntervalId) {
                        clearInterval(timePollIntervalId);
                        this.setState({ timePollIntervalId: null });
                    }
                    break;
                }
                default: {
                    if (timePollIntervalId) {
                        clearInterval(timePollIntervalId);
                        this.setState({timePollIntervalId: null});
                    }
                    break;
                }
            }
        }

        render() {
            let playerState = { ...this.state, ...this.props.players[this.state.id]};
            return <WrappedComponent youtubeState={playerState} youtubePlayer={this.state.youtubePlayer} createYoutubePlayer={this.createYoutubePlayer} />
        }
    }

    const mapStoreToProps = (store) => {
        return {
            playerManager: store.playerManager,
            players: store.players
        }
    }

    return connect(mapStoreToProps, {})(YoutubeConnect); 
}

export default youtubeConnect;