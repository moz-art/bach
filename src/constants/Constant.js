export const WS_EVENTS = {
  GROUP_CHANGED: 'groupChanged',
  GROUP_CLOSED: 'groupClosed',
  GROUP_NOTE_OFF: 'noteOff',
  GROUP_NOTE_ON: 'noteOn',
  GROUP_STOP: 'stop',
  GROUP_TRACK_INFO: 'trackInfo',
  JOIN_GROUP: 'joinGroup',
  MUSICIAN_READY: 'musicianReady',
  GROUP_PROGRAM_CHANGE: 'programChange',
  REQUEST_ROLE: 'requestRole',
  SET_SPEED: 'setSpeed',
  SET_SONG: 'setSong',
  SET_VOLUME: 'setVolume',
  SONG_INFO: 'songInfo',
  START: 'start',
  TRACK_INFO: 'trackInfo'
};

export const ROLE_TYPE = {
  CONDUCTOR: 'conductor',
  MUSICIAN: 'musician'
};

export const API_EVENTS = {
  CLOSED: 'closed',
  ERROR: 'error',
  GROUP_CHANGED: 'groupChanged',
  GROUP_CLOSED: 'groupClosed',
  GROUP_JOINED: 'groupJoined',
  GROUP_NOTE_OFF: 'noteOff',
  GROUP_NOTE_ON: 'noteOn',
  GROUP_TRACK_INFO: 'trackInfo',
  GROUP_PROGRAM_CHANGE: 'programChange',
  GROUP_STOP: 'stop',
  SONG_INFO: 'songInfo',
  OPENED: 'opened',
  ROLE_RESULT: 'requestRoleResult'
};

export const BASE_URL = '/bach/';

export const PAGE_URL = {
  PIN_CODE: `${BASE_URL}`,
  ROLE_SELECTOR: `${BASE_URL}role`,
  CONDUCTOR: `${BASE_URL}conductor`,
  MUSICIAN: `${BASE_URL}musician`,
};
