import React, { PureComponent } from 'react';
import MusicianCard from '../components/MusicianCard';
import { PAGE_URL } from '../constants/Constant';

class Musician extends PureComponent {
  componentDidMount = () => {
    if (!this.props.location.state || !this.props.location.state.code) {
      // no code no show.
      this.props.history.replace(PAGE_URL.PIN_CODE);
      return;
    }
  }

  render() {
    if (!this.props.location.state || !this.props.location.state.code) {
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
