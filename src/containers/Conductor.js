import React, { PureComponent } from 'react';
import Leap from 'leapjs';
import { PAGE_URL } from '../constants/Constant';

const POSITION_THRESHOLD = 100;

class Conductor extends PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      meters: []
    };
  }
  componentDidMount () {
    if (!this.props.location.state || !this.props.location.state.code) {
      // no code no show.
      this.props.history.replace(PAGE_URL.PIN_CODE);
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
          this.setState({meters});
          startPosition = null;
          max = 0;
          step = (step + 1) % 4;
        }
      }
    });
  }

  renderMeters() {
    return this.state.meters
      .map((meter, i) => <div key={i}>{meter.step}: {meter.duration}</div>);
  }

  render() {
    if (!this.props.location.state || !this.props.location.state.code) {
      // no code no show.
      return null;
    }
    return (
      <div>
        {this.renderMeters()}
      </div>
    );
  }
}

export default Conductor;
