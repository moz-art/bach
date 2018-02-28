import EventEmitter from 'eventemitter3';
import { API_EVENTS, WS_EVENTS } from '../constants/Constant';

export class ServerAPI extends EventEmitter {
  constructor(url) {
    this.url = url || this.getServerURL();
  }

  getServerURL = () => {
    const PORT = window.location.port || 80;
    return `ws://${window.location.hostname}:${PORT}`;
  }

  connect = () => {
    if (this.socket) {
      return;
    }

    this.socket = new WebSocket(this.url);
    this.socket.onopen = this.handleSocketOpened;
    this.socket.onclose = this.handleSocketClosed;
    this.socket.onmessage = this.handleSocketMessage;
  }

  close = () => {
    if (!this.socketOpened) {
      throw new Error('socket is not ready, you should wait for socket ready before sending any request.');
    }
    this.socket.close();
  }

  handleSocketOpened = () => {
    this.socketOpened = true;
    this.emit(API_EVENTS.OPENED);
  }

  handleSocketClosed = () => {
    this.emit(API_EVENTS.CLOSED);
    delete this.socket;
    this.socketOpened = false;
  }

  handleSocketError = (e, ...args) => {
    this.emit(API_EVENTS.ERROR, e, args);
    console.error('socket error', e);
  }

  handleSocketMessage = (msg) => {
    let data;
    try {
      data = JSON.parse(msg.data);
    } catch (ex) {
      this.emit(ex, msg.data);
      console.error('socket data error', msg.data, ex);
      return;
    }
    switch (data.event) {
      case WS_EVENTS.JOIN_GROUP:
        this.emit(API_EVENTS.GROUP_JOINED, data.group);
        break;
      case WS_EVENTS.REQUEST_ROLE:
        this.emit(API_EVENTS.ROLE_RESULT, data.role);
        break;
      // GROUP API
      case WS_EVENTS.GROUP_CLOSED:
        this.emit(API_EVENTS.GROUP_CLOSED);
        break;
      case WS_EVENTS.GROUP_CHANGED:
        this.emit(API_EVENTS.GROUP_CHANGED, data.group);
        break;
      case WS_EVENTS.TRACK_INFO:
        this.emit(API_EVENTS.GROUP_TRACK_INFO, data.data, data.channels);
        break;
      case WS_EVENTS.NOTE_ON:
        this.emit(API_EVENTS.GROUP_NOTE_ON, data.note, data.velocity);
        break;
      case WS_EVENTS.NOTE_OFF:
        this.emit(API_EVENTS.GROUP_NOTE_OFF), data.note;
        break;
    }
  }

  sendMessage = (msg) => {
    if (!this.socketOpened) {
      throw new Error('socket is not ready, you should wait for socket ready before sending any request.');
    }
    this.socket.send(JSON.stringify(msg));
  }

  joinGroup = (code) => {
    this.sendMessage({
      event: WS_EVENTS.JOIN_GROUP,
      code
    });
  }

  requestRole = (type) => {
    this.sendMessage({
      event: WS_EVENTS.REQUEST_ROLE,
      type
    });
  }
}

export default new ServerAPI();
