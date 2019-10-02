const SETTINGS__HANDLE_SOCKET_CONNECT = "SETTINGS__HANDLE_SOCKET_CONNECT";
const SETTINGS__HANDLE_SOCKET_DISCONNECT = "SETTINGS__HANDLE_SOCKET_DISCONNECT";

function handleSocketConnect() {
  return {
    event: "connect",
    handle: SETTINGS__HANDLE_SOCKET_CONNECT,
  }
}

function handleSocketDisconnect() {
  return {
    event: "disconnect",
    handle: SETTINGS__HANDLE_SOCKET_DISCONNECT,
  }
}

export default {
  SETTINGS__HANDLE_SOCKET_CONNECT,
  handleSocketConnect,
  SETTINGS__HANDLE_SOCKET_DISCONNECT,
  handleSocketDisconnect
}