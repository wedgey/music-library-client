import React from "react";
import { Button, Col, Divider, Icon, Row, Slider } from "antd";
import { connect } from "react-redux";

// import PlayerVideo from "./video";
import youtubeManager from "../../utils/youtubeManager";

import { YTPlayerRepeat, YTPlayerState } from "../../utils/enums";
import { formatToMinutes } from "../../utils/common";

class PlayerBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerState: -1,
            playerCurrentTime: 0,
            playerVideoTime: 0,
            timePollIntervalId: null,
            isSeeking: false,
            seekPercentage: 0,
            playerOptions: {
                repeatStatus: YTPlayerRepeat.normal
            },
            currentSong: {}
        }

        this.player = null;

        this.toggleRepeat = this.toggleRepeat.bind(this);
        this.togglePlay = this.togglePlay.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.onPlayerReady = this.onPlayerReady.bind(this);
        this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
        this.onPlayerOptionsChange = this.onPlayerOptionsChange.bind(this);
        this.onSeek = this.onSeek.bind(this);
        this.onSeekTo = this.onSeekTo.bind(this);
    }

    async componentDidMount() {
        let playerOptions = {
            width: '92',
            height: '36',
            // videoId: 'V2hlQkVJZhE',
            events: {
                'onReady': this.onPlayerReady,
                'onStateChange':  this.onPlayerStateChange
            }
        }
        let playerId = await youtubeManager.createYoutubePlayer(this.youtubePlayerElement, playerOptions, true);
        let ytPlayer = youtubeManager.getPlayer(playerId);
        ytPlayer.player.getIframe().addEventListener('YTPlayerOptionsChange', this.onPlayerOptionsChange);
        this.player = ytPlayer;
        this.setState({playerOptions: ytPlayer.playerOptions });
    }

    componentWillUnmount() {
        clearInterval(this.state.timePollIntervalId);
    }

    onPlayerReady(e) {
        this.setState({ playerVideoTime: this.player.getDuration() });
    }

    onPlayerStateChange(e) {
        this.setState({ playerState: e.data, currentSong: this.player.getCurrentSong() });
        switch (e.data) {
            case YTPlayerState.playing: {
                let pollId = setInterval(() => { 
                    let currentTime = this.player.getCurrentTime();
                    if (this.state.isSeeking) return;
                    let duration = this.player.getDuration();
                    this.setState({
                        playerVideoTime: duration,
                        playerCurrentTime: currentTime
                    });
                }, 100)
                this.setState({ timePollIntervalId: pollId });
                break;
            }
            case YTPlayerState.ended: {
                this.setState({ playerCurrentTime: 0 });
                if (this.state.timePollIntervalId) {
                    clearInterval(this.state.timePollIntervalId);
                    this.setState({timePollIntervalId: null});
                }
            }
            default: {
                if (this.state.timePollIntervalId) {
                    clearInterval(this.state.timePollIntervalId);
                    this.setState({timePollIntervalId: null});
                }
            }
        }
    }

    onPlayerOptionsChange(e) {
        this.setState({playerOptions: e.detail});
    }

    togglePlay() {
        let { player } = this;
        if (player) player.getPlayerState() === YTPlayerState.playing ? player.pauseVideo() : player.playVideo();
    }

    toggleRepeat() {
        let { player } = this;
        if (player) player.toggleRepeat();
    }

    handlePrevious() {
        let { player } = this;
        if (player) player.playPrevious();
    }

    handleNext() {
        let { player } = this;
        if (player) player.playNext();
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
        let repeatIcon = this.state.playerOptions.repeatStatus === YTPlayerRepeat.repeatOne ? 'reload' : this.state.playerOptions.repeatStatus === YTPlayerRepeat.repeatPlaylist ? 'retweet' : 'swap-right';
        let { artistNames, title } = this.state.currentSong || {};
        return (
            <div className="cmpt-player-bar">
                <Row type="flex" align="middle" style={{height: '100%'}} gutter={12}>
                    <Col className="ytContainer">
                        <div className="video-overlay"></div>
                        <div ref={r => { this.youtubePlayerElement = r}}></div>
                    </Col>
                    <Col style={{width: '250px'}}>
                        <span className="truncate" style={{lineHeight: '1em'}}>{title}</span><br />
                        <span className="truncate" style={{lineHeight: '1em'}}>{artistNames}</span>
                    </Col>
                    <Col className="auto">
                        <Slider tipFormatter={this.formatSliderToolTip} step={0.001} max={this.state.playerVideoTime} value={this.state.playerCurrentTime} onChange={this.onSeek} onAfterChange={this.onSeekTo} />
                    </Col>
                    <Col>
                        <span>{formatToMinutes(this.state.playerVideoTime)}</span>
                    </Col>
                    <Col>
                        <Button.Group>
                            <Button icon='backward' onClick={this.handlePrevious} />
                            <Button icon={this.state.playerState === YTPlayerState.playing ? 'pause' : 'caret-right'} onClick={this.togglePlay} />
                            <Button icon='forward' onClick={this.handleNext} />
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

export default PlayerBar;