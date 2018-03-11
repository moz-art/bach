import React, { PureComponent } from 'react';
import Leap from 'leapjs';
import styled from 'styled-components';

import { PAGE_URL } from '../constants/Constant';
import ServerAPI from '../ws/ServerAPI';
import fakeFrames from '../constants/fakeFrames';

const POSITION_THRESHOLD = 100;

const Parts = styled.div`
  display: flex;
`;

const Part = styled.div`
  flex: auto;
  background-color: ${props => props.current ? 'red' : 'white'};
`;


const STEPS = ['down', 'left', 'right', 'up'];
const AXIS = [1, 0, 0, 1];
const OPTIONS = {};

class Conductor extends PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      meters: [],
      bpm: 0,
      currentPart: 0,
      volumes: [0.5, 0.5, 0.5, 0.5]
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

        const currentPosition = hands.right.palmPosition;

        const nextMax = Math.abs(currentPosition[AXIS[this.step]] - this.startPosition[AXIS[this.step]]);
        if (nextMax > this.max) {
          this.max = nextMax;
        } else if (this.max - nextMax > POSITION_THRESHOLD) {
          const duration = ((frame.timestamp - this.previousTimestamp) / 1000).toFixed(0);
          const meters = this.state.meters.slice();
          meters.push({ step: STEPS[this.step], duration });
          const bpm = Math.floor(60 / (duration / 1000));
          ServerAPI.setSpeed(bpm);
          this.setState({ meters, bpm });
          this.startPosition = null;
          this.max = 0;
          this.step = (this.step + 1) % STEPS.length;
        }
      }

      if (hands.left) {
        const [x, y] = hands.left.palmPosition;
        const direction = hands.left.palmNormal[1];
        const volumes = this.state.volumes.slice();
        const currentPart = Math.floor((x + 200) / 200 * this.state.volumes.length);
        const nextVolume = Math.min(Math.max((y - 100) / 300, 0), 1);
        const currentVolume = volumes[currentPart];

        // palm face to up
        if ((direction > 0 && nextVolume > currentVolume) ||
          (direction <= 0 && nextVolume <= currentVolume)) {
          volumes[currentPart] = nextVolume;
          ServerAPI.setVolume(currentPart, nextVolume);
        }

        this.setState({ currentPart, volumes });
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
    return new Array(this.state.volumes.length).fill(0).map((_, index) => {
      return <Part current={this.state.currentPart === index} key={index}>{this.state.volumes[index]}</Part>
    });
  }

  render() {
    if (!this.props.location.state || !this.props.location.state.code || !ServerAPI.ready) {
      // no code no show.
      return null;
    }
    return (
      <div>
        <button onClick={this.onStart}>Start</button>
        <button onClick={this.playDummy}>Play Dummy Data</button>
        <p>
          BPM: {this.state.bpm}
        </p>
        <Parts>
          {this.renderParts()}
        </Parts>
        {this.renderMeters()}
      </div>
    );
  }
}

export default Conductor;
