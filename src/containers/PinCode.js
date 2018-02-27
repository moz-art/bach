import React, { PureComponent } from 'react';
import { Button } from 'reactstrap';
import { withRouter } from 'react-router-dom'

class PinCode extends PureComponent {

  handlePinCodeInputed = () => {
    this.props.history.push('/player_type');
  }

  render() {
    return (
      <section>
        Please input your PINCODE:
        <Button onClick={this.handlePinCodeInputed}>Next</Button>
      </section>
    );
  }
}

export default withRouter(PinCode);
