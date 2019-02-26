import React, { Component } from 'react';
import _helper from 'utils/helper';
import socketIOClient from "socket.io-client";
import SimplePeer from 'simple-peer';

import { Link } from "react-router-dom";

import './_room-page.scss';

class RoomPage extends Component {
  constructor(props) {
    super(props);

    this.socket = null;
    this.peer = null;
  }

  componentDidMount() {
    console.log('welcome to room: ', this.props.match.params.roomId)
    this.initSocket()
  }

  initSocket = () => {
    this.socket = socketIOClient('localhost:4300');
    this.socket.on('connect', () => {
      this.socket.on('peer', (data) => {
        let peerId = data.peerId;
        this.peer = new SimplePeer({ initiator: data.initiator, trickle: false, });

        this.socket.on('signal', (data) => {
          if (data.peerId == peerId) {
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
          this.peer.send("hey peer");
        });

        this.peer.on('data', () => {
          console.log('wow')
        })

      })
    })


  }


  render() {
    return (
      <div className="front-page-container">
          <button onClick={() => {
            this.socket.emit('dataa', 'bob the builda')
          }}>send</button>
          <button onClick={() => {
            this.peer.send('hello can u hear me?')
          }}>simplo</button>

      </div>
    );
  }
}

export default RoomPage;
