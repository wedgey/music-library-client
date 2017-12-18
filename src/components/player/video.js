import React from "react";

let youtubeAPI;

class PlayerVideo extends React.Component {
    constructor(props) {
        super(props);

        this.player = null;

        this.onPlayerReady = this.onPlayerReady.bind(this);
        this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
        this.loadYoutubePlayer = this.loadYoutubePlayer.bind(this);
    }

    componentDidMount() {
        if (!youtubeAPI) this.loadYoutubeScript();
        else this.loadYoutubePlayer(window['YT']);
    }

    loadYoutubeScript() {
        youtubeAPI = new Promise((resolve) => {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = () => { resolve(window.YT); };
        });
        youtubeAPI.then((YT) => {
            if (!this.youtubePlayerAnchor) return;
            this.player = new YT.Player(this.youtubePlayerAnchor, {
                height: '36',
                width: '92',
                videoId: 'V2hlQkVJZhE',
                playerVars: {
                    controls: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    fs: 0,
                    iv_load_policy: 3,
                    loop: 1,
                    playlist: 'V2hlQkVJZhE'
                },
                events: {
                    'onReady': this.props.onPlayerReady || this.onPlayerReady,
                    'onStateChange': this.props.onPlayerStateChange || this.onPlayerStateChange
                }
            });
        });
    }

    loadYoutubePlayer(YT) {
        if (!this.youtubePlayerAnchor) return;
        this.player = new YT.Player(this.youtubePlayerAnchor, {
            height: '36',
            width: '92',
            videoId: 'V2hlQkVJZhE',
            playerVars: {
                controls: 0,
                showinfo: 0,
                modestbranding: 1,
                fs: 0,
                iv_load_policy: 3,
                loop: 1,
                playlist: 'V2hlQkVJZhE'
            },
            events: {
                'onReady': this.props.onPlayerReady || this.onPlayerReady,
                'onStateChange': this.props.onPlayerStateChange || this.onPlayerStateChange
            }
        });
    }

    onPlayerReady(e) {
        console.log('hello');
        e.target.playVideo();
    }

    onPlayerStateChange(e) {
        // console.log(e);
    }

    render() {
        return (
            <div className="cmpt-player-video">
                <div ref={(r) => {this.youtubePlayerAnchor = r}}></div>
            </div>
        )
    }
}

export default PlayerVideo;