import React, { Component } from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FrontPage from 'containers/front-page';
import RoomPage from 'containers/room-page';

class AppContent extends Component {
  componentDidMount() {

  }

  render() {
    return (
      <div className="app-content-container">
        <Route exact path='/' component={FrontPage} />
        <Route exact path='/room/:roomId' component={RoomPage} />
      </div>
    );
  }
}

export default AppContent;
