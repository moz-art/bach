import React, { PureComponent } from 'react';
import MusicianCard from '../components/MusicianCard';
import { PAGE_URL, NOTE_MAP } from '../constants/Constant';
import ServerAPI from '../ws/ServerAPI';

const TEST_SCORE = [32, 28, 28, 30, 26, 26, 24, 26, 28, 30, 32, 32];

class Musician extends PureComponent {

  constructor(props) {
    super(props);
    if (!this.isReady()) {
      return;
    }
    this.state = {
      activeInstrumentIndex: 0,
      activeNote: -1,
      instruments: ['acoustic_grand_piano'], // null,
      noteText: '',
      group: props.location.state.group
    };

    setTimeout(() => {
      this.initMIDI();
    }, 1000);
  }

  componentDidMount = () => {
    const { history } = this.props;
    if (!this.isReady()) {
      // no code no show.
      history.replace(PAGE_URL.PIN_CODE);
      return;
    }
  }

  isReady = () => {
    const { location } = this.props;
    return location.state && location.state.code && location.state.group && ServerAPI.ready
  }

  initMIDI = () => {
    const { instruments } = this.state;
    window.MIDI.loadPlugin({
      soundfontUrl: "/MIDI.js/soundfont/",
      instruments: instruments,
      callback: () => {
        ServerAPI.musicianReady();
        const activeNote = TEST_SCORE.shift();
        this.setState({
          activeNote,
          noteText: NOTE_MAP[activeNote]
        }, this.play);
      }
    });
  }

  play = () => {
    const { activeNote } = this.state;
    window.MIDI.noteOn(0, activeNote, 68, 0);
    if (TEST_SCORE.length) {
      setTimeout(() => {
        const nextNote = TEST_SCORE.shift();
        // off the previous one
        window.MIDI.noteOff(0, activeNote, 0);
        this.setState({
          activeNote: nextNote,
          noteText: NOTE_MAP[nextNote]
        }, this.play);
      }, 1000);
    } else {
      setTimeout(() => {
        window.MIDI.noteOff(0, activeNote, 0);
      }, 1000);
    }
  }

  render = () => {
    if (!this.isReady()) {
      // no code no show.
      return null;
    }

    const {
      activeInstrumentIndex,
      instruments,
      noteText
    } = this.state;
    return (
      <MusicianCard
        activeInstrumentIndex={activeInstrumentIndex}
        instruments={instruments}
        note={noteText}
        title='Musician'
      />
    );
  }
}

export default Musician;
