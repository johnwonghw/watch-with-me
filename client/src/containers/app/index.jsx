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
      isConnected: false,
      videoSource: '',
    }

  }
  
  componentDidMount() {
    navigator.getUserMedia({ video: true, audio: true }, (stream) => {

      this.peer1 = new SimplePeer({
        initiator: window.location.hash === '#init',
        trickle: false,
        stream
      });
      this.peer2 = new SimplePeer({ 
        stream 
      });

      this.peer1.on('signal', (data) => {
        console.log('SIGNAL peer1', JSON.stringify(data))
        this.setState({ myId: JSON.stringify(data) })
      })
  
      this.peer1.on('connect', (data) => {
        console.log('CONNECTED YESSS!')
        this.peer1.send('HELLO ITS ME FROM THE FUTURE')
        this.setState({ isConnected: true })
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

      this.peer1.on('stream', (data) => {
        this.setState({ videoSource: window.URL.createObjectURL(data) }, () => {
          this.refs['video-dom'].play()
        })    
      })

      this.peer2.on('stream', (data) => {
        this.setState({ videoSource: window.URL.createObjectURL(data) }, () => {
          this.refs['video-dom'].play()
        })
      })
    }, function () {})

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

  sendMessage = () => {
    let { message, isConnected } = this.state;
    if (message && isConnected) {
      if (window.location.hash === '#init') {
        this.peer1.send(message)
      } else {
        this.peer2.send(message)
      }
      this.addMessage('me', message)
    }
  }

  render() {
    let { myId, peerId, message, messageList, videoSource } = this.state;

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
          onKeyPress={(e) => {
            console.log(e.key)
            if (e.key === 'Enter') {
              this.sendMessage()
            }
          }}
        />
        <div onClick={this.sendMessage}>send</div>

        <div className="message-container">
          {messageList.map((currMessage) => {
            return (
              <div className={`message ${currMessage.author === 'me' ? 'my-message' : 'peer-message'}`}>{currMessage.text}</div>
            )
          })}
        </div>

        <video src={videoSource} ref="video-dom" ></video>
        <button onClick={() => {
          this.refs['video-dom'].play()
        }}>PLAY</button>

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
