import React, { Component } from 'react';
import _helper from 'utils/helper';
import socketIOClient from "socket.io-client";
import SimplePeer from 'simple-peer';
import VieoPlayer from 'containers/video-player';
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
      isLeader: false,
      currVideo: '',
      videoValue: '',
      playing: false,

      messageValue: '',
      messageList: [],
      

    }
  }

  componentDidMount() {
    console.log('welcome to the room: ', this.props.match.params.roomId)
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

      this.socket.on('update-room-data', (data) => {
        let {
          roomClientCount
        } = data;
        this.setState({
          connections: roomClientCount,
          isLeader: this.state.isLeader || roomClientCount === 1 ? true : false
        })
      })



      this.socket.on('peer', (data) => {
        let peerId = data.peerId;
        this.peer = new SimplePeer({ initiator: data.initiator, trickle: false, });

        this.socket.on('signal', (data) => {
          if (data.peerId == peerId) {
            console.log('happening')
            this.peer.signal(data.signal);
          }
        })

        this.peer.on('signal', (data) => {
          this.socket.emit('signal', {
            signal: data,
            peerId
          })
        })

        this.peer.on('connect', () => {
          console.log('Peer connection established');
          this.peer.send(JSON.stringify({
            type: "log",
            value: "hi my peers"
          }));
        });

        this.peer.on('data', (data) => {
          console.log('rtc received data: ', data)
          let dec = new TextDecoder("utf-8")
          let parsedData = JSON.parse(dec.decode(data))
          let { type, playing, message } = parsedData;
          // let { playing } = data;
          if (type === 'video-action') {
            this.setState({ playing })
          } else if (type === 'message') {
            this.setState({ messageList: [...this.state.messageList, message] })
          } else if (type === 'log') {
            console.log('rtc log: ', parsedData.value)
          }
        })

      })

      this.socket.on('update-video', (data) => {
        let { videoSrc } = data;
        this.setState({
          currVideo: videoSrc
        })
      })

      this.socket.on('log', (data) => {
        console.log('logging: ', data)
      })
    })
  }

  changeVid = () => {
    let { videoValue } = this.state;

    this.socket.emit('pend-video', {
      videoSrc: videoValue
    })
  }

  handleClickPlay = () => {
    this.peer.send(JSON.stringify({
      type: 'video-action',
      playing: !this.state.playing
    }))
    this.setState({
      playing: !this.state.playing
    })
  }

  handleSendMessage = () => {
    if (this.state.messageValue) {
      let messageBody = {
        "username": "me",
        "text": this.state.messageValue
      }

      this.peer.send(JSON.stringify({
        type: "message",
        message: {
          "username": "weirdo",
          "text": this.state.messageValue
        }
      }))
      this.setState({
        messageList: [...this.state.messageList, {
          "username": "me",
          "text": this.state.messageValue
        }],
        messageValue: ''
      })
    }
  }

  render() {
    console.log(this.state)
    return (
      <div className="front-page-container">
        <div>There are currently {this.state.connections} people in this room!</div>
        <div>{this.state.isLeader ? 'I am the leader!' : 'I am just a follower'}</div>
        <button onClick={() => {
          this.socket.emit('dataa', 'bob the builda')
        }}>send</button>
        <button onClick={() => {
          this.peer.send('hello can u hear me?')
        }}>simplo</button>

        {this.state.isLeader
          ? <div>
            <input
              name="video-src"
              onChange={(e) => {
                this.setState({ videoValue: e.target.value })
              }}
              value={this.state.videoValue}
            />
            <button onClick={this.changeVid}>Change vid</button>
          </div>
          : ''}

        <div>
          <VieoPlayer
            url={this.state.currVideo}
            handleClickPlay={this.handleClickPlay}
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
