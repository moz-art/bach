import React, { PureComponent } from 'react';
import Leap from 'leapjs';
import styled from 'styled-components';

import { PAGE_URL } from '../constants/Constant';
import ServerAPI from '../ws/ServerAPI';

const POSITION_THRESHOLD = 100;

const Parts = styled.div`
  display: flex;
`;

const Part = styled.div`
  flex: auto;
  background-color: ${props => props.current ? 'red' : 'white'};
`;

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
  componentDidMount () {
    const { location, history } = this.props;
    if (!location.state || !location.state.code || !ServerAPI.ready) {
      // no code no show.
      history.replace(PAGE_URL.PIN_CODE);
      return;
    }

    const steps = ['down', 'left', 'right', 'up'];
    const axis = [1, 0, 0, 1];
    const options = {};
    let startPosition = null;
    let previousTimestamp;
    let max = 0;
    let step = 0;
    Leap.loop(options, frame => {
      if (frame.hands.length > 0) {
        const hands = {};
        frame.hands.forEach(hand => {
          hands[hand.type] = hand;
        });

        if (hands.right) {
          if (!startPosition) {
            startPosition = hands.right.palmPosition;
            previousTimestamp = frame.timestamp;
          }

          const currentPosition = hands.right.palmPosition;

          const nextMax = Math.abs(currentPosition[axis[step]] - startPosition[axis[step]]);
          if (nextMax > max) {
            max = nextMax;
          } else if (max - nextMax > POSITION_THRESHOLD) {
            const duration = ((frame.timestamp - previousTimestamp) / 1000).toFixed(0);
            const meters = this.state.meters.slice();
            meters.push({ step: steps[step], duration });
            const bpm = Math.floor(60 / (duration / 1000));
            ServerAPI.setSpeed(bpm);
            this.setState({meters, bpm});
            startPosition = null;
            max = 0;
            step = (step + 1) % steps.length;
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
          if (direction > 0 && nextVolume > currentVolume ||
            direction <= 0 && nextVolume <= currentVolume) {
            volumes[currentPart] = nextVolume;
          }

          this.setState({currentPart, volumes});
        }
      }
    });
  }

  onStart = () => {
    ServerAPI.setSong('pachelbel_canon');
    ServerAPI.start();
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
