import acousticGrandPiano from '../images/instruments/acoustic_grand_piano.png';
import bassoon from '../images/instruments/bassoon.png';
import clarinet from '../images/instruments/clarinet.png';
import contrabass from '../images/instruments/contrabass.png';
// import flute from '../images/instruments/flute.png';
import frenchHorn from '../images/instruments/french_horn.png';
import oboe from '../images/instruments/oboe.png';
// import stringEnsemble from '../images/instruments/string_ensemble.png';
// import timpani from '../images/instruments/timpani.png';
import trumpet from '../images/instruments/trumpet.png';
import violin from '../images/instruments/violin.png';


// flute, timpani, string_ensemble are missing
export const INSTRUMENTS = [
  'acoustic_grand_piano',
  'bassoon',
  'clarinet',
  'contrabass',
  'flute',
  'french_horn',
  'oboe',
  'string_ensemble',
  'timpani',
  'trumpet',
  'violin',
];
// Be aware of INSTRUMENTS array
export const INSTRUMENT_IMGS = {
  'acoustic_grand_piano': acousticGrandPiano,
  'bassoon': bassoon,
  'clarinet': clarinet,
  'contrabass': contrabass,
  // 'flute': flute,
  'french_horn': frenchHorn,
  'oboe': oboe,
  // 'string_ensemble': stringEnsemble,
  // 'timpani': timpani,
  'trumpet': trumpet,
  'violin': violin,
};

export const INSTRUMENT_TEXT = {
  'acoustic_grand_piano': 'Acoustic Grand Piano',
  'bassoon': 'Bassoon',
  'clarinet': 'Clarinet',
  'contrabass': 'Contrabass',
  'flute': 'Flute',
  'french_horn': 'French Horn',
  'oboe': 'Oboe',
  'string_ensemble': 'StringEnsemble',
  'timpani': 'Timpani',
  'trumpet': 'Trumpet',
  'violin': 'Violin',
};
