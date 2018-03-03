export const WS_EVENTS = {
  GROUP_CHANGED: 'groupChanged',
  GROUP_CLOSED: 'groupClosed',
  GROUP_NOTE_OFF: 'noteOff',
  GROUP_NOTE_ON: 'noteOn',
  GROUP_TRACK_INFO: 'trackInfo',
  JOIN_GROUP: 'joinGroup',
  MUSICIAN_READY: 'musicianReady',
  REQUEST_ROLE: 'requestRole',
  SET_SPEED: 'setSpeed',
  SET_SONG: 'setSong',
  START: 'start'
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
  OPENED: 'opened',
  ROLE_RESULT: 'requestRoleResult'
};

export const BASE_URL = '/';

export const PAGE_URL = {
  PIN_CODE: `${BASE_URL}`,
  ROLE_SELECTOR: `${BASE_URL}role`,
  CONDUCTOR: `${BASE_URL}conductor`,
  MUSICIAN: `${BASE_URL}musician`,
};

export const NOTE_MAP = {
  24: 'C',
  26: 'D',
  28: 'E',
  30: 'F',
  32: 'G',
}
