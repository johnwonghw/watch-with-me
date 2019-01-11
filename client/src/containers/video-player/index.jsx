import React, { Component } from 'react';
import _ from 'lodash';
import { FaPlay, FaPause } from 'react-icons/fa';

import './_video-player.scss';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerState: {}
    }
    this.init();
    this.video = 'yY6XnbWnK4o' //video id
    window['onYouTubeIframeAPIReady'] = (e) => {
      this.YT = window['YT'];
      this.reframed = false;
      this.player = new window['YT'].Player('player', {
        videoId: this.video,
        // height: '100%',
        // width: '100%',  
        events: {
          'onStateChange': this.onPlayerStateChange.bind(this),
          'onError': this.onPlayerError.bind(this),
          'onReady': (e) => {
            if (!this.reframed) {
              this.reframed = true;
              // reframe(e.target.a);
            }
          }
        },
        modestbranding: 1,

        playerVars: {
          controls: 0,
          enablejsapi: 1,
          // modestbranding: true,
        },
      });
    };
  }

  handlePlayClick = () => {
    console.log('click')
    if (this.state.playerState.data == 1) {
      this.player.pauseVideo();
    } else if (this.state.playerState.data == 2) {
      this.player.playVideo();
    }
  }

  render() {
    return (
      <div className="video-player-container">
        <div className="youtube-player">
          <div className="embed-responsive embed-responsive-16by9" id="player">
          </div>
        </div>
        <div
          className="video-controls-container"
          onMouseEnter={() => {console.log('mouse-enter')}}
          onMouseLeave={() => {console.log('mouse-leave')}}
          onMouseMove={() => {console.log('mouse-move')}}
        >
          <div
            className="play-pause-btn-wrapper"
            onClick={this.handlePlayClick}
          >
            {this.state.playerState.data == 1 ? <FaPause /> : <FaPlay />}

          </div>
        </div>
      </div>
    );
  }

  init() {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  onPlayerStateChange(event) {
    console.log(event)
    this.setState({
      playerState: _.cloneDeep(event)
    })
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        if (this.cleanTime() == 0) {
          console.log('started ' + this.cleanTime());
        } else {
          console.log('playing ' + this.cleanTime())
        };
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() != 0) {
          console.log('paused' + ' @ ' + this.cleanTime());
        };
        break;
      case window['YT'].PlayerState.ENDED:
        console.log('ended ');
        break;

    };
  };
  //utility
  cleanTime() {
    return Math.round(this.player.getCurrentTime())
  };
  onPlayerError(event) {
    switch (event.data) {
      case 2:
        console.log('' + this.video)
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    };
  };
}

export default VideoPlayer;
