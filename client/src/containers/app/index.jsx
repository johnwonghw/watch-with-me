import React, { Component } from 'react';
import logo from './logo.svg';
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
    }
  }
  render() {
    let { myId, peerId } = this.state;
    return (
      <div className="App">

        <textarea
          value={myId}
        />
        <div className="media-container">
          <VideoPlayer 
            url="https://www.youtube.com/watch?v=xszeN3CVxk4"
          />
          <div>asdf</div>
        </div>
      </div>
    );
  }
}

export default App;
