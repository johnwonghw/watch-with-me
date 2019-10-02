import _actions from './actions';
import _ from 'lodash';
import _helper from 'utils/helper';

export function getDefaultState() {
  return {
    isMobile: false,
    socketConnected: false,
  }
}

function handleSocketConnect(state, action) {
  let finalState = _.cloneDeep(state);
  finalState.socketConnected = true;
  return finalState;
}

function handleSocketDisconnect(state, action) {
  let finalState = _.cloneDeep(state);
  finalState.socketConnected = false;
  return finalState;
}

// function socketReconnect(state, action) {
//   let finalState = _.cloneDeep(state);
//   let { isAuthenticated, token } = action.payload;
  
//   if (isAuthenticated && token) {
//     action.asyncDispatch({
//       event: "check-socket-room",
//       emit: { token }
//     })
//   }

//   return finalState;
// }


export default {
  'settings': (state = getDefaultState(), action) => {
    switch (action.type) {
      case 'SETTINGS__SET_STATE':
        return Object.assign({}, _.cloneDeep(state), action.state);
      case _actions.SETTINGS__HANDLE_SOCKET_CONNECT:
        return handleSocketConnect(state, action);
      case _actions.SETTINGS__HANDLE_SOCKET_DISCONNECT:
        return handleSocketDisconnect(state, action);
      // case 'SETTINGS__SOCKET_RECONNECT_SUCCESS':
      //   return socketReconnect(state, action);
      default:
        return state;
    }
  }
}
