import React from "react";
import { Button, Col, Divider, Icon, Row, Slider } from "antd";
import { connect } from "react-redux";

import youtubeManager from "../../utils/youtubeManager";
import { YTPlayerRepeat, YTPlayerState } from "../../utils/enums";
import { formatToMinutes } from "../../utils/common";

class PlayerBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSeeking: false,
            seekPercentage: 0,
            playerVideoTime: 0,
            playerCurrentTime: 0,
            timePollIntervalId: null,
            playerStore: null
        }

        this.player = null;

        // this.handlePlayerStateChange = this.handlePlayerStateChange.bind(this);
        this.onSeek = this.onSeek.bind(this);
        this.onSeekTo = this.onSeekTo.bind(this);
        this.togglePlay = this.togglePlay.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.toggleRepeat = this.toggleRepeat.bind(this);
        // this.updatePlayerTime = this.updatePlayerTime.bind(this);
        this.handleUpdatePlayerTime = this.handleUpdatePlayerTime.bind(this);

    }

    componentDidMount() {
        if (!youtubeManager.getGlobalPlayer()) youtubeManager.createYoutubePlayer(this.youtubePlayerElement, {}, true);
    }

    componentWillReceiveProps(nextProps) {
        let newState = {};
        if (youtubeManager.hasPlayersChanged(this.props, nextProps)) {
            this.setState({ playerStore: nextProps.players[nextProps.playerManager.globalPlayerId] })
            let player = youtubeManager.getGlobalPlayer();
            if (player && player.getStorePlayer().isReady && this.player !== player) {
                let callback = this.handleUpdatePlayerTime;
                if (this.player) this.player.unsubscribeFromTime(callback);

                this.player = player;
                this.player.subscribeToTime(callback);
            }
        }
    }

    componentWillUnmount() {
        this.player.unsubscribeFromTime(this.handleUpdatePlayerTime);
    }

    handleUpdatePlayerTime({currentTime, duration}) {
        let stateUpdate = { playerVideoTime: duration };
        if (!this.state.isSeeking) stateUpdate.playerCurrentTime = currentTime;
        this.setState(stateUpdate);
    }

    togglePlay() {
        this.player.getPlayerState() === YTPlayerState.playing ? this.player.pauseVideo() : this.player.playVideo();
    }

    handlePrevious() {
        if (this.player) this.player.playPrevious();
    }

    handleNext() {
        if (this.player) this.player.playNext();
    }

    toggleRepeat() {
        if (this.player) this.player.toggleRepeat();
    }

    onSeek(time) {
        if (time === this.state.playerVideoTime) return;
        if (!this.state.isSeeking) this.setState({isSeeking: true});
        this.setState({playerCurrentTime: time});
    }

    onSeekTo(time) {
        this.setState({playerCurrentTime: time});
        this.player.seekTo(time, true);
        if (this.state.isSeeking) this.setState({isSeeking: false});
    }

    formatSliderToolTip(value) {
        return formatToMinutes(value);
    }

    render() {
        let playerStore = this.state.playerStore || {};
        let { artistNames, title } = this.player ? this.player.getCurrentSong() || {} : {};
        let repeatIcon = playerStore.repeatStatus === YTPlayerRepeat.repeatOne ? 'reload' : playerStore.repeatStatus === YTPlayerRepeat.repeatPlaylist ? 'retweet': 'swap-right';
        return (
            <div className="cmpt-player-bar">
                <Row type="flex" align="middle" style={{height: '100%'}} gutter={12}>
                    <Col className="ytContainer">
                        <div className="video-overlay"></div>
                        <div style={{width: '92px', height: '36px'}} ref={r => { this.youtubePlayerElement = r}}></div>
                    </Col>
                    <Col style={{width: '250px'}}>
                        <span className="truncate" style={{lineHeight: '1em'}}>{title}</span><br />
                        <span className="truncate" style={{lineHeight: '1em'}}>{artistNames}</span>
                    </Col>
                    <Col className="auto">
                        <Slider tipFormatter={this.formatSliderToolTip} step={0.001} max={this.state.playerVideoTime} value={this.state.playerCurrentTime} onChange={this.onSeek} onAfterChange={this.onSeekTo} />
                    </Col>
                    <Col>
                        <span>{`${this.state.playerVideoTime - this.state.playerCurrentTime === 0 ? "" : "-"}${formatToMinutes(this.state.playerVideoTime - this.state.playerCurrentTime)}`}</span>
                    </Col>
                    <Col>
                        <Button.Group>
                            <Button icon="backward" onClick={this.handlePrevious} />
                            <Button icon={playerStore.playerState === YTPlayerState.playing ? 'pause' : 'caret-right'} onClick={this.togglePlay} />
                            <Button icon="forward" onClick={this.handleNext} />
                        </Button.Group>
                        <Button.Group>
                            <Button icon={repeatIcon} onClick={this.toggleRepeat} />
                        </Button.Group>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStoreToProps = (store) => {
    return {
        players: store.players,
        playerManager: store.playerManager
    }
}

export default connect(mapStoreToProps, {})(PlayerBar);