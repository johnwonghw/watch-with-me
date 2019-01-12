import React, { Component } from 'react';
import VideoPlayer from 'containers/video-player';
import ReactPlayer from 'react-player'

import SimplePeer from 'simple-peer';
import './_app.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myId: '',
      peerId: '',
      message: '',
      messageList: [],
    }
    
    this.peer1 = new SimplePeer({
      initiator: window.location.hash === '#init',
      trickle: false
    });
    this.peer2 = new SimplePeer();
  }

  componentDidMount() {
    this.peer1.on('signal', (data) => {
      console.log('SIGNAL peer1', JSON.stringify(data))
      this.setState({ myId: JSON.stringify(data) })
    })

    this.peer1.on('connect', (data) => {
      console.log('CONNECTED YESSS!')
      this.peer1.send('HELLO ITS ME FROM THE FUTURE')
    })

    this.peer1.on('data', (data) => {
      let dec = new TextDecoder("utf-8")
      console.log('RECEIVED DATA1', dec.decode(data))
      this.addMessage('peer', dec.decode(data))
    })

    this.peer2.on('data', (data) => {
      let dec = new TextDecoder("utf-8")
      console.log('RECEIVED DATA2', dec.decode(data))
      this.addMessage('peer', dec.decode(data))
    })

    this.peer2.on('signal', (data) => {
      console.log('SIGNAL peer2', JSON.stringify(data))
      this.setState({ myId: JSON.stringify(data) })
    })
  }

  addMessage = (author, text) => {
    this.setState({
      messageList: [...this.state.messageList, {
        author,
        text
      }],
      message: '',
    })
  }

  render() {
    let { myId, peerId, message, messageList } = this.state;
    console.log(this.state.messageList)
    return (
      <div className="App">

        <p>MY ID</p>
        <textarea
          value={myId}
          onChange={(e) => { this.setState({ myId: e.target.value }) }}
        />

        <p>PEER'S ID</p>
        <textarea
          value={peerId}
          onChange={(e) => { this.setState({ peerId: e.target.value }) }}
        />
        <div onClick={() => {
          if (window.location.hash === '#init') {
            this.peer1.signal(peerId)
          } else {
            this.peer2.signal(peerId)
          }
        }}>connect</div>

        <textarea
          value={message}
          onChange={(e) => { this.setState({ message: e.target.value }) }}
        />
        <div onClick={() => {
          if (message) {
            if (window.location.hash === '#init') {
              this.peer1.send(message)
            } else {
              this.peer2.send(message)
            }
            this.addMessage('me', message)
          }
        }}>send</div>

        <div className="message-container">
          {messageList.map((currMessage) => {
            return (
              <div className={`message ${currMessage.author === 'me' ? 'my-message' : 'peer-message'}`}>{currMessage.text}</div>
            )
          })}
        </div>

        {/* <div className="media-container">
          <VideoPlayer
            url="https://www.youtube.com/watch?v=xszeN3CVxk4"
          />
          <div>asdf</div>
        </div> */}
      </div>
    );
  }
}

export default App;
