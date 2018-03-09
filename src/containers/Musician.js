import React, { PureComponent } from 'react';
import MusicianCard from '../components/MusicianCard';
import {
  API_EVENTS,
  PAGE_URL
} from '../constants/Constant';
import ServerAPI from '../ws/ServerAPI';
import { initMIDI, downloadMIDI } from '../actions/MidiFile';
import Replayer from '../actions/Replayer';

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
      noteText: '??',
      groupCode: props.location.state.group
    };
    console.log('wait 1 sec to initialize');
    setTimeout(() => {
      this.handleTrackInfo([0, 1, 2, 3],
                           ['violin', 'contrabass'],
                           { song: 'pachelbel_canon' });
    }, 1000);
  }

  componentDidMount = () => {
    const { history } = this.props;
    if (!this.isReady()) {
      // no code no show.
      history.replace(PAGE_URL.PIN_CODE);
      return;
    }

    ServerAPI.on(API_EVENTS.GROUP_TRACK_INFO, this.handleTrackInfo);
  }

  componentWillUnmount = () => {
    ServerAPI.off(API_EVENTS.GROUP_TRACK_INFO, this.handleTrackInfo);
  }

  isReady = () => {
    const { location } = this.props;
    return location.state && location.state.code && location.state.group && ServerAPI.ready
  }

  handleTrackInfo = (channels, instruments, group) => {
    this.setState({ instruments });
    Promise.all([downloadMIDI(group.song), initMIDI(instruments)]).then(([midiFile, midi]) => {
      // TODO: intercept information and set the to state.
      this.replayer = new Replayer(midiFile, window.MIDI)
      ServerAPI.musicianReady();
      console.log('wait for 1 sec before playing');
      setTimeout(() => {
        this.replayer.replay();
      })
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
