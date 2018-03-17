import MidiFile from 'jasmid-module/midifile';

export const downloadMIDI = (song) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `../midi/${song}.mid`);
    xhr.overrideMimeType('text/plain; charset=x-user-defined');
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        console.log('midi downloaded');
        /* munge response into a binary string */
        const t = xhr.responseText || '' ;
        const ff = [];
        const mx = t.length;
        for (let z = 0; z < mx; z++) {
          ff[z] = String.fromCharCode(t.charCodeAt(z) & 255);
        }
        resolve(MidiFile(ff.join('')));
      } else if (xhr.readyState === 4) {
        alert('failed to download midi file, please reload');
        reject(xhr.status)
      }
    };
    xhr.send();
  });
}

export const initMIDI = (instruments) => {
  return new Promise((resolve, reject) => {
    console.log('load sound font for ', instruments);
    window.MIDI.loadPlugin({
      soundfontUrl: '/MIDI.js/soundfont/',
      instruments: instruments,
      callback: () => {
        console.log(instruments, 'loaded');
        resolve(true);
      }
    });
  });
}
