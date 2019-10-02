import React, { Component } from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _settingsAction from 'containers/settings/actions'
import FrontPage from 'containers/front-page';
import RoomPage from 'containers/room-page';

class AppContent extends Component {
  componentDidMount() {
    let { handleSocketConnect, handleSocketDisconnect } = this.props;

    handleSocketConnect();
    handleSocketDisconnect();
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

const mapStateToProps = (state) => {
  
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleSocketConnect: bindActionCreators(() => {
      return _settingsAction.handleSocketConnect()
    }, dispatch),
    handleSocketDisconnect: bindActionCreators(() => {
      return _settingsAction.handleSocketDisconnect()
    }, dispatch),
  }
};

AppContent = connect(mapStateToProps, mapDispatchToProps)(AppContent);
export default AppContent;
