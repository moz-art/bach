import EventEmitter from 'eventemitter3';
import { API_EVENTS, WS_EVENTS } from '../constants/Constant';

export class ServerAPI extends EventEmitter {
  constructor(url) {
    super();
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
    if (!this.ready) {
      throw new Error('socket is not ready, you should wait for socket ready before sending any request.');
    }
    this.socket.close();
  }

  handleSocketOpened = () => {
    this.ready = true;
    this.emit(API_EVENTS.OPENED);
  }

  handleSocketClosed = () => {
    this.emit(API_EVENTS.CLOSED);
    delete this.socket;
    this.ready = false;
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
        this.emit(API_EVENTS.ROLE_RESULT, data.role, data.group);
        break;
      // GROUP API
      case WS_EVENTS.GROUP_CLOSED:
        this.emit(API_EVENTS.GROUP_CLOSED);
        break;
      case WS_EVENTS.GROUP_CHANGED:
        this.emit(API_EVENTS.GROUP_CHANGED, data.group);
        break;
      case WS_EVENTS.TRACK_INFO:
        this.emit(API_EVENTS.GROUP_TRACK_INFO, data.channels, data.instruments, data.group);
        break;
      case WS_EVENTS.NOTE_ON:
        this.emit(API_EVENTS.GROUP_NOTE_ON, data.notes);
        break;
      case WS_EVENTS.NOTE_OFF:
        this.emit(API_EVENTS.GROUP_NOTE_OFF, data.notes);
        break;
      case WS_EVENTS.SONG_INFO:
        this.emit(API_EVENTS.SONG_INFO, data.song, data.tracks);
        break;
      default:
        console.error('unsupported event', msg);
    }
  }

  sendMessage = (msg) => {
    if (!this.ready) {
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

  requestRole = (role) => {
    this.sendMessage({
      event: WS_EVENTS.REQUEST_ROLE,
      role
    });
  }

  setSpeed = (speed) => {
    this.sendMessage({
      event: WS_EVENTS.SET_SPEED,
      speed
    });
  }

  setSong = (song) => {
    this.sendMessage({
      event: WS_EVENTS.SET_SONG,
      song
    });
  }

  setVolume = (channel, volume) => {
    this.sendMessage({
      event: WS_EVENTS.SET_VOLUME,
      channel,
      volume
    });
  };

  start = (song) => {
    this.sendMessage({ event: WS_EVENTS.START });
  }

  musicianReady = () => {
    this.sendMessage({ event: WS_EVENTS.MUSICIAN_READY });
  }
}

export default new ServerAPI('ws://localhost:8000/');
