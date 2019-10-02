import io from 'socket.io-client';

export default function socketMiddleware() {
  let socket = null;

  if (process.env.NODE_ENV === 'production') {
    socket = io();
  } else {
    socket = io('localhost:4300', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity
    });
  }
  // socket.on('hello', (...data) => {
  //   console.log('caught something: ', data)
  // })
  // socket.on('update-message', (...data) => {
  //   console.log('dodo caught: ', data)
  // })

  return ({ dispatch }) => next => (action) => {
    if (typeof action === 'function') {
      return next(action);
    }

    const {
      event,
      leave,
      handle,
      emit,
      ...rest
    } = action;

    if (!event) {
      return next(action);
    }

    if (leave) {
      socket.removeListener(event);

    } else {
      if (emit) {
        socket.emit(event, emit)
      } else {
        let handleEvent = handle;
        if (typeof handleEvent === 'string') {
          handleEvent = (result) => dispatch({ type: handle, result, ...rest });
        }
        return socket.on(event, handleEvent);
      }
    }
  };
}
