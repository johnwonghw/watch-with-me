import React, { Component } from 'react';
import ReactPlayer from 'react-player'
import { FaPlay, FaPause } from 'react-icons/fa';

import './_video-player.scss';

class VideoPlayer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isReady: false,
      showControls: false,
      playedSeconds: 0,
      totalSeconds: 0,
    }
  }

  getMinuteDisplay = (totalSeconds) => {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = ("0" + (totalSeconds % 60)).slice(-2);
    return `${minutes}:${seconds}`
  }

  handleOnReady = () => {
    this.setState({ isReady: true, playedSeconds: 0, totalSeconds: 0 })
  }

  handleOnPlay = () => {
    this.props.handleVideoAction(true);
  }

  handleOnPause = () => {
    this.props.handleVideoAction(false);
  }

  getPlayPauseBtn = () => {
    let { playing } = this.props;
    let click = () => {
      this.props.handleVideoAction(!playing);
    }

    if (playing) {
      return (
        <FaPause color="white" onClick={click} />
      )
    } else {
      return <FaPlay color="white" onClick={click} />
    }
  }

  timeSeekerRef = timeSeeker => {
    this.timeSeeker = timeSeeker
  }

  render() {
    let {
      playerRef,
      url,
      playing,
      handleSeekTo
    } = this.props;

    let {
      showControls,
      playedSeconds,
      totalSeconds
    } = this.state;

    return (
      <div
        className="video-player-container"
        onMouseEnter={() => { this.setState({ showControls: true }) }}
        onMouseLeave={() => { this.setState({ showControls: false }) }}
      >
        <div className="player-wrapper">
          <ReactPlayer
            // url={url}
            volume={0}
            url={'https://www.youtube.com/watch?v=khZK783T6_8'}
            ref={playerRef}
            className="react-player"
            width='100%'
            height='100%'
            controls={false}
            onReady={this.handleOnReady}
            onPlay={this.handleOnPlay}
            onPause={this.handleOnPause}
            // onSeek={() => console.log('abc')}
            playing={playing}
            progressInterval={250}
            onDuration={(totalSeconds) => { this.setState({ totalSeconds: Math.ceil(totalSeconds) }) }}
            onProgress={({ loaded, loadedSeconds, played, playedSeconds }) => {
              this.setState({ playedSeconds: Math.ceil(playedSeconds) })
            }}
          />
        </div>
        <div className={`controls-wrapper ${showControls ? '' : 'hide'}`}>
          <div className="play-pause-btn-wrapper">
            {this.getPlayPauseBtn()}
          </div>
          <div className="time-seeker-wrapper">
            <div ref={this.timeSeekerRef} className="time-seeker-bar" onClick={(e) => {
              const position = e.clientX - this.timeSeeker.offsetLeft;
              const barWidth = this.timeSeeker.offsetWidth
              const positionPercent = position / barWidth;
              handleSeekTo(positionPercent)
            }}>
              <div className="time-seeker-bar-played" style={{ width: `${(playedSeconds / totalSeconds) * 100}%` }}></div>
            </div>
            <div className="time-seeker-time">{this.getMinuteDisplay(playedSeconds)} / {this.getMinuteDisplay(totalSeconds)}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default VideoPlayer;
