import React, { Component } from 'react';
import _helper from 'utils/helper';
import socketIOClient from "socket.io-client";
import VideoPlayer from 'containers/video-player';
import { connect } from 'react-redux';

import { Link } from "react-router-dom";

import './_room-page.scss';

class RoomPage extends Component {
  constructor(props) {
    super(props);

    this.socket = null;
    this.peer = null;
    this.state = {
      connections: 0,
      currVideo: '',
      videoValue: '',
      playing: true,
      messageValue: '',
      messageList: [],


    }
  }

  componentDidMount() {
    console.log('welcome to the roossms: ', this.props.match.params.roomId)
    this.initSocket()
  }

  initSocket = () => {
    let roomId = this.props.match.params.roomId;
    if (process.env.NODE_ENV === 'production') {
      this.socket = socketIOClient();
    } else {
      this.socket = socketIOClient('localhost:4300');
    }

    this.socket.on('connect', () => {
      this.socket.emit('join-room', {
        roomId,
      })
    })

    this.socket.on('update-room-data', (data) => {
      let {
        roomClientCount
      } = data;
      this.setState({
        connections: roomClientCount
      })
    })

    this.socket.on('update-video', (data) => {
      let { videoSrc } = data;
      this.setState({
        currVideo: videoSrc
      })
    })

    this.socket.on('room-message', (data) => {
      console.log({ data })
      this.setState({
        messageList: [...this.state.messageList, data],
      })
    })

    this.socket.on('play-video', () => {
      this.setState({ playing: true })
    })

    this.socket.on('pause-video', () => {
      this.setState({ playing: false })
    })

    this.socket.on('seek-video', (data) => {
      console.log(data.played)
      // TODO should not be called for original seeker as they will be 'seeking' twice.
      this.player.seekTo(data.played)
    })

    this.socket.on('log', (data) => {
      console.log('logging: ', data)
    })

  }

  changeVid = () => {
    let { videoValue } = this.state;

    this.socket.emit('pend-video', {
      videoSrc: videoValue
    })
  }

  handleVideoAction = (playing) => {
    this.socket.emit(playing ? 'play-video' : 'pause-video')
    this.setState({ playing })
  }

  handleSendMessage = () => {
    if (this.state.messageValue) {
      this.socket.emit('room-message', {
        username: "asdf",
        text: this.state.messageValue
      })

      this.setState({
        messageList: [...this.state.messageList, {
          "username": "me",
          "text": this.state.messageValue
        }],
        messageValue: ''
      })

    }
  }

  playerRef = player => {
    this.player = player
  }

  handleSeekTo = (frac) => {
    this.socket.emit('seek-video', {
      played: frac
    });

    this.player.seekTo(frac);
  }

  render() {
    // console.log(this.state)
    return (
      <div className="front-page-container">
        <div>There are currently {this.state.connections} people in this room!</div>

        <div>
          <input
            name="video-src"
            onChange={(e) => {
              this.setState({ videoValue: e.target.value })
            }}
            value={this.state.videoValue}
          />
          <button onClick={this.changeVid}>Change vid</button>
        </div>

        <div>
          <VideoPlayer
            handleSeekTo={this.handleSeekTo}
            playerRef={this.playerRef}
            url={this.state.currVideo}
            handleVideoAction={this.handleVideoAction}
            playing={this.state.playing}
          />
        </div>

        <div className="messages-contaner">

          <div style={{ padding: "10px" }}>
            <div className="message-list" style={{ display: "flex", flexDirection: "column", padding: "10px", height: "200px", overflow: "auto" }}>
              {this.state.messageList.map((currMessage) => {
                return (
                  <div style={{
                    padding: "10px",
                    background: currMessage.username === "me" ? "#4949f5" : "gray",
                    maxWidth: "100px",
                    alignSelf: currMessage.username === "me" ? "flex-end" : "flex-start",
                    borderRadius: "5px",
                    color: "white",
                    margin: "7px 0"
                  }}>{currMessage.text}</div>
                )
              })}
            </div>
            <form onSubmit={(e) => {
              e.preventDefault()
            }}>
              <input
                onChange={(e) => this.setState({ messageValue: e.target.value })}
                value={this.state.messageValue}
                style={{ padding: "12px", fontSize: "14px", width: "70%" }}
              />
              <button
                type="submit"
                onClick={this.handleSendMessage}
                style={{ padding: "12px", fontSize: "14px", color: "white", background: "#4949f5", borderRadius: "4px" }}
              >send</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default RoomPage;
