import React, { PureComponent } from 'react';
import MusicianCard from '../components/MusicianCard';

class Musician extends PureComponent {
  render() {
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
