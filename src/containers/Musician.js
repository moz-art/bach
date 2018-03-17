import React, { PureComponent } from 'react';
import MusicianCard from '../components/MusicianCard';
import {
  API_EVENTS,
  PAGE_URL
} from '../constants/Constant';
import NOTE_MAP from '../constants/NoteMap.json';
import ServerAPI from '../ws/ServerAPI';
import { initMIDI } from '../actions/MidiFile';
// import Replayer from '../actions/Replayer';

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
    // setTimeout(() => {
    //   this.handleTrackInfo([0, 1, 2, 3], ['violin', 'contrabass'], {
    //     song: 'pachelbel_canon',
    //     volumes: [0.5, 0.5, 0.5, 0.5]
    //   });
    // }, 1000);

    // setTimeout(() => {
    //   ServerAPI.setSong('pachelbel_canon');
    //   ServerAPI.start();
    // }, 1000)
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
    // ServerAPI.on(API_EVENTS.GROUP_CHANGED, this.handleGroupChanged);
  }

  componentWillUnmount = () => {
    ServerAPI.off(API_EVENTS.GROUP_TRACK_INFO, this.handleTrackInfo);
    ServerAPI.off(API_EVENTS.GROUP_NOTE_ON, this.handleNoteOn);
    ServerAPI.off(API_EVENTS.GROUP_NOTE_OFF, this.handleNoteOff);
    ServerAPI.off(API_EVENTS.GROUP_PROGRAM_CHANGE, this.handleProgramChanged);
    ServerAPI.off(API_EVENTS.GROUP_STOP, this.handleStop);
    // ServerAPI.off(API_EVENTS.GROUP_CHANGED, this.handleGroupChanged);
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
    // Promise.all([]).then(([midiFile, midi]) => {
      // TODO: intercept information and set the to state.
      // this.replayer = new Replayer(midiFile, {
      //   noteOn: (channel, note, velocity, delay) => {
      //     window.MIDI.noteOn(channel, note, velocity, delay);
      //     this.setState({
      //       activeNote: note,
      //       note: NOTE_MAP[note]
      //     });
      //   },
      //   noteOff: (channel, note, delay) => {
      //     window.MIDI.noteOff(channel, note, delay);
      //   },
      //   programChange: (channel, program) => {
      //     window.MIDI.programChange(channel, program);
      //   }
      // })
      /* TODO: move this to server */
      // this.replayer.setVolumes(group.volumes);
      
      // setInterval(() => {
      //   this.handleGroupChanged({ speed, volumes: [0.1, 0.1, 0.1, 1] });
      //   if (speed >= 300) {
      //     speed = 60;
      //   } else {
      //     speed += 10;
      //   }

      //   if (volume > 0.9) {
      //     volume = 0.5;
      //   } else {
      //     volume += 0.1
      //   }
      // }, 1000)
    // });
  }

  // handleGroupChanged = (group) => {
    // if (group && group.volumes && this.replayer) {
    //   // TODO: move this to server
    //   // this.replayer.setVolumes(group.volumes);
    // }

    // if (group && group.speed && this.replayer) {
    //   this.replayer.setSpeed(group.speed);
    //   if (!this.replayer.isPlaying()) {
    //     this.replayer.replay();
    //   }
    // }
  // }

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
