import React, { PureComponent } from 'react';
import MusicianCard from '../components/MusicianCard';
import {
  API_EVENTS,
  PAGE_URL
} from '../constants/Constant';
import NOTE_MAP from '../constants/NoteMap.json';
import ServerAPI from '../ws/ServerAPI';
import { initMIDI } from '../actions/MidiFile';

class Musician extends PureComponent {

  constructor(props) {
    super(props);
    if (!this.isReady()) {
      return;
    }
    this.state = {
      activeInstrumentIndex: 0,
      activeNote: -1,
      instruments: null,
      note: null,
      groupCode: props.location.state.group
    };
  }

  componentDidMount = () => {
    const { history } = this.props;
    if (!this.isReady()) {
      // no code no show.
      history.replace(PAGE_URL.PIN_CODE);
      return;
    }

    ServerAPI.on(API_EVENTS.GROUP_TRACK_INFO, this.handleTrackInfo);
    ServerAPI.on(API_EVENTS.GROUP_NOTE_ON, this.handleNoteOn);
    ServerAPI.on(API_EVENTS.GROUP_NOTE_OFF, this.handleNoteOff);
    ServerAPI.on(API_EVENTS.GROUP_PROGRAM_CHANGE, this.handleProgramChanged);
    ServerAPI.on(API_EVENTS.GROUP_STOP, this.handleStop);
  }

  componentWillUnmount = () => {
    ServerAPI.off(API_EVENTS.GROUP_TRACK_INFO, this.handleTrackInfo);
    ServerAPI.off(API_EVENTS.GROUP_NOTE_ON, this.handleNoteOn);
    ServerAPI.off(API_EVENTS.GROUP_NOTE_OFF, this.handleNoteOff);
    ServerAPI.off(API_EVENTS.GROUP_PROGRAM_CHANGE, this.handleProgramChanged);
    ServerAPI.off(API_EVENTS.GROUP_STOP, this.handleStop);
  }

  isReady = () => {
    const { location } = this.props;
    return location.state && location.state.code && location.state.group && ServerAPI.ready
  }

  handleNoteOff = (note) => {
    if (this.state.channels.indexOf(note.channel) > -1) {
      window.MIDI.noteOff(note.channel, note.note, 0);
    }
  }

  handleNoteOn = (note) => {
    if (this.state.channels.indexOf(note.channel) > -1) {
      window.MIDI.noteOn(note.channel, note.note, note.velocity, 0);
      this.setState({
        activeNote: note,
        note: NOTE_MAP[note]
      });
    }
  }

  handleStop = () => {
    window.MIDI.stopAllNotes();
  }

  handleProgramChanged = (data) => {
    window.MIDI.programChange(data.channel, data.program);
  }

  handleTrackInfo = (channels, instruments, group) => {
    this.setState({ channels, instruments });
    initMIDI(instruments).then(() => {
      ServerAPI.musicianReady();
    });
  }

  render = () => {
    if (!this.isReady()) {
      // no code no show.
      return null;
    }

    const {
      activeInstrumentIndex,
      instruments,
      note
    } = this.state;
    return (
      <MusicianCard
        activeInstrumentIndex={activeInstrumentIndex}
        instruments={instruments}
        note={note}
        title='Musician'
      />
    );
  }
}

export default Musician;
