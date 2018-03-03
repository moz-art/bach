import React, { PureComponent } from 'react';
import MusicianCard from '../components/MusicianCard';
import { PAGE_URL } from '../constants/Constant';
import ServerAPI from '../ws/ServerAPI';

class Musician extends PureComponent {
  componentDidMount = () => {
    const { location, history } = this.props;
    if (!location.state || !location.state.code || !ServerAPI.ready) {
      // no code no show.
      history.replace(PAGE_URL.PIN_CODE);
      return;
    }
  }

  render() {
    const { location } = this.props;
    if (!location.state || !location.state.code || !ServerAPI.ready) {
      // no code no show.
      return null;
    }
    const fakeInstruments = ['bassoon', 'acoustic_grand_piano'];
    return (
      <MusicianCard
        activeInstrumentIndex={1}
        instruments={fakeInstruments}
        note='C#'
        title='Musician'
      />
    );
  }
}

export default Musician;
