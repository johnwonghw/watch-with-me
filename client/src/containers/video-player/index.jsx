import React, { Component } from 'react';
import ReactPlayer from 'react-player'
import { FaPlay, FaPause } from 'react-icons/fa';

import './_video-player.scss';

class VideoPlayer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isReady: false,
      // playing: false,
      showControls: false,
    }
  }

  handleOnReady = () => {
    this.setState({ isReady: true })
  }

  // handleOnPlay = () => {
  //   this.setState({ status: 'playing' })
  // }

  // handleOnPause = () => {
  //   this.setState({ status: 'paused' })
  // }

  getPlayPauseBtn = () => {
    let { playing } = this.props;
    let click = () => {
      this.props.handleClickPlay();
      // this.setState({ playing: !playing }) 
    }
    if (playing) {
      return (
        <FaPause color="white" onClick={click} />
      )
    } else {
      return <FaPlay color="white" onClick={click} />
    }
  }

  handleMouseMove = () => {
    console.log('asf')
    // this.setState({ showControls: true })

    // let fadeOutTimeout = setTimeout(() => {
    //   this.setState({ showControls: false})
    // }, 3000);
  }

  render() {
    let {
      url,
      playing,
    } = this.props;

    let {
      showControls
    } = this.state;

    return (
      <div
        className="video-player-container"
        onMouseEnter={() => { this.setState({ showControls: true }) }}
        onMouseLeave={() => { this.setState({ showControls: false }) }}
      >
        <div className="player-wrapper">
          <ReactPlayer
            url={url}
            className="react-player"
            width='100%'
            height='100%'
            onReady={this.handleOnReady}
            onPlay={this.handleOnPlay}
            onPause={this.handleOnPause}
            playing={playing}
          />
        </div>
        <div className={`controls-wrapper ${showControls ? '' : 'hide'}`}>
          {this.state.status}
          <div className="play-pause-btn-wrapper">
            {this.getPlayPauseBtn()}
          </div>
        </div>
      </div>
    );
  }
}

export default VideoPlayer;
