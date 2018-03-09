import React, { PureComponent } from 'react';
import Leap from 'leapjs';
import { PAGE_URL } from '../constants/Constant';
import ServerAPI from '../ws/ServerAPI';

const POSITION_THRESHOLD = 100;

class Conductor extends PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      meters: [],
      bpm: 0
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
        const hand = frame.hands[0];
        if (!startPosition) {
          startPosition = hand.palmPosition;
          previousTimestamp = frame.timestamp;
        }

        const currentPosition = hand.palmPosition;

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
          step = (step + 1) % 4;
        }
      }
    });
  }

  onStart = () => {
    ServerAPI.start();
  }

  renderMeters() {
    return this.state.meters
      .map((meter, i) => <div key={i}>{meter.step}: {meter.duration}</div>);
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
        {this.renderMeters()}
      </div>
    );
  }
}

export default Conductor;
