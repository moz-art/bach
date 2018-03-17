import React, { PureComponent } from 'react';
import Leap from 'leapjs';
import styled from 'styled-components';

import { PAGE_URL, API_EVENTS } from '../constants/Constant';
import { INSTRUMENT_TEXT } from '../constants/Instruments';
import ServerAPI from '../ws/ServerAPI';
import fakeFrames from '../constants/fakeFrames';

// const ServerAPI = {
//   setSong: () => {},
//   setSpeed: () => {},
//   setVolume: () => {},
//   start: () => {},
//   ready: true
// };

const POSITION_THRESHOLD = 100;

const GridContainer = styled.div`
  min-height: 600px;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 20% 80%;
`;

const Controls = styled.div`
  grid-column-start: 1;
  grid-column-end: 3;
  align-self: center;
  justify-self: center;
`

const Metronome = styled.div`
  align-self: center;
  justify-self: center;
  text-align: center;
  font-size: 50px;
`;

const Parts = styled.div`
  display: flex;
`;

const PartWrapper = styled.div`
  flex-grow: 1;
  flex-basis: 0;
  border: 1px solid #DDD;
  margin: 5px;
  padding: 10px;
`;

const Part = styled.div`
  height: 100%;
  text-align: center;
  background: ${props => {
    const percent = 1 - props.percent;
    const color = props.current ? '#99be8f' : '#4e8064';
    let gradient = `linear-gradient(white ${percent * 100}%, ${color} ${percent * 100}%)`
    return gradient;
  }};
`;


const STEPS = ['down', 'left', 'right', 'up'];
const AXIS = [1, 0, 0, 1];
const OPTIONS = {};

class Conductor extends PureComponent {
  constructor (props) {
    super(props);

    this.bpmHistory = [];
    this.state = {
      meters: [],
      bpm: 0,
      currentPart: 0,
      parts: [],
      palmPosition: {
        x: 0,
        y: 0
      }
    };
  }

  onFrameFire = (frame) => {

    if (frame.hands.length > 0) {
      const hands = {};
      frame.hands.forEach(hand => {
        hands[hand.type] = hand;
      });

      if (hands.right) {
        if (!this.startPosition) {
          this.startPosition = hands.right.palmPosition;
          this.previousTimestamp = frame.timestamp;
        }

        const palmPosition = {
          x: hands.right.palmPosition[0],
          y: hands.right.palmPosition[1]
        };

        this.setState({ palmPosition });

        const currentPosition = hands.right.palmPosition;

        const nextMax = Math.abs(currentPosition[AXIS[this.step]] - this.startPosition[AXIS[this.step]]);
        if (nextMax > this.max) {
          this.max = nextMax;
        } else if (this.max - nextMax > POSITION_THRESHOLD) {
          const duration = ((frame.timestamp - this.previousTimestamp) / 1000).toFixed(0);
          const meters = this.state.meters.slice();
          meters.push({ step: STEPS[this.step], duration });
          const bpm = Math.floor(60 / (duration / 1000));
          this.bpmHistory.push(bpm);
          this.bpmHistory = this.bpmHistory.slice(-10);
          const nextBpm = Math.floor(this.bpmHistory.reduce((previous, current) => previous + current) / this.bpmHistory.length);
          ServerAPI.setSpeed(nextBpm);
          this.setState({ meters, bpm: nextBpm });
          this.startPosition = null;
          this.max = 0;
          this.step = (this.step + 1) % STEPS.length;
        }
      }

      if (hands.left) {
        const [x, y] = hands.left.palmPosition;
        const direction = hands.left.palmNormal[1];
        const parts = this.state.parts.slice();
        const currentPart = Math.floor((x + 200) / 200 * this.state.parts.length);
        const nextVolume = Math.min(Math.max((y - 100) / 300, 0), 1);
        const currentVolume = parts[currentPart] ? parts[currentPart].volume : 0;

        // palm face to up
        if ((direction > 0 && nextVolume > currentVolume) ||
          (direction <= 0 && nextVolume <= currentVolume)) {
          const part = parts[currentPart];
          if (part) {
            part.volume = nextVolume;
            ServerAPI.setVolume(currentPart, nextVolume);
          }
        }

        this.setState({ currentPart, parts });
      }
    }
  }

  componentDidMount () {
    const { location, history } = this.props;
    if (!location.state || !location.state.code || !ServerAPI.ready) {
      // no code no show.
      history.replace(PAGE_URL.PIN_CODE);
      return;
    }

    ServerAPI.on(API_EVENTS.SONG_INFO, (song, tracks) => {
      const parts = tracks.map((track, i) => {
        return {
          name: INSTRUMENT_TEXT[track[0]] + ` (${i + 1})`,
          volume: 0.5
        };
      });
      this.setState({ parts });
    });

    this.startPosition = null;
    this.previousTimestamp = null;
    this.max = 0;
    this.step = 0;
    Leap.loop(OPTIONS, this.onFrameFire);
  }

  onStart = () => {
    ServerAPI.setSong('pachelbel_canon');
    ServerAPI.start();
  }

  playDummy = () => {
    let i = 0;
    const interval = 10;
    const callback = () => {
      const frame = fakeFrames[i];
      if (frame) {
        this.onFrameFire(frame);
        i++;
        setTimeout(callback, interval);
      }
    }

    setTimeout(callback, interval);
  }

  renderMeters() {
    return this.state.meters
      .map((meter, i) => <div key={i}>{meter.step}: {meter.duration}</div>);
  }

  renderParts () {
    return new Array(this.state.parts.length).fill(0).map((_, index) => {
      const part = this.state.parts[index];
      const val = part.volume.toFixed(3);
      return (
        <PartWrapper key={index}>
          <Part percent={val} current={this.state.currentPart === index}>{part.name}</Part>
        </PartWrapper>
      );
    });
  }

  render() {
    if (!this.props.location.state || !this.props.location.state.code || !ServerAPI.ready) {
      // no code no show.
      return null;
    }

    const svgWidth = 400;
    const svgHeight = 400;
    const viewBox = `0 0 ${svgWidth} ${svgHeight}`;
    const mappingRatio = 1.5;
    const x = this.state.palmPosition.x * mappingRatio;
    const y = svgHeight - (this.state.palmPosition.y * mappingRatio) + 300;
    return (
      <GridContainer>
        <Controls>
          <button onClick={this.onStart}>Start</button>
          <button onClick={this.playDummy}>Play Dummy Data</button>
        </Controls>
        <Parts>
          {this.renderParts()}
        </Parts>
        <Metronome>
          <p>BPM: {this.state.bpm}</p>
          <svg width={svgWidth} height={svgHeight} viewBox={viewBox}
            xmlns="http://www.w3.org/2000/svg">

            <circle id="palm-position" cx={x} cy={y} r="10" />

            <line x1="200" y1="20" x2="200" y2="380"
              strokeWidth="2" stroke="black" />

            <line x1="180" y1="360" x2="20" y2="200"
              strokeWidth="2" stroke="black" />

            <line x1="40" y1="200" x2="380" y2="200"
              strokeWidth="2" stroke="black" />

            <line x1="360" y1="180" x2="220" y2="20"
              strokeWidth="2" stroke="black" />
          </svg>
        </Metronome>
      </GridContainer>
    );
  }
}

export default Conductor;
