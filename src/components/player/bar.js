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
            globalPlayer: null
        }
    }

    async componentDidMount() {
        let ytGlobalPlayer = youtubeManager.getGlobalPlayer();
        if (!ytGlobalPlayer) {
            let playerId = await youtubeManager.createYoutubePlayer(this.youtubePlayerElement, {}, true);
            this.setState({globalPlayer: youtubeManager.getGlobalPlayer()});
        } else if (ytGlobalPlayer !== this.state.globalPlayer) {
            this.setState({globalPlayer: ytGlobalPlayer});
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.player != this.props.player) {
            this.setState({ globalPlayer: youtubeManager.getGlobalPlayer });
        }
    }

    emptyFunc() {}

    render() {
        console.log(youtubeManager.getGlobalPlayer());
        debugger;
        return (
            <div className="cmpt-player-bar">
                <Row type="flex" align="middle" style={{height: '100%'}} gutter={12}>
                    <Col className="ytContainer">
                        <div className="video-overlay"></div>
                        <div style={{width: '92px', height: '36px'}} ref={r => { this.youtubePlayerElement = r}}></div>
                    </Col>
                    <Col stye={{width: '250px'}}>
                        <span className="truncate" style={{lineHeight: '1em'}}>Title</span><br />
                        <span className="truncate" style={{lineHeight: '1em'}}>Artist Name</span>
                    </Col>
                    <Col className="auto">
                        <Slider tipFormatter={this.formatSliderToolTip} step={0.001} max={100} onChange={this.emptyFunc} onAfterChange={this.emptyFunc} />
                    </Col>
                    <Col>
                        <span>{formatToMinutes(1000)}</span>
                    </Col>
                    <Col>
                        <Button.Group>
                            <Button icon="backward" onClick={this.emptyFunc} />
                            <Button icon="pause" onClick={this.emptyFunc} />
                            <Button icon="forward" onClick={this.emptyFunc} />
                        </Button.Group>
                        <Button.Group>
                            <Button icon="reload" onClick={this.emptyFunc} />
                        </Button.Group>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStoreToProps = (store) => {
    return {
        player: store.player
    }
}

export default connect(mapStoreToProps, {})(PlayerBar);