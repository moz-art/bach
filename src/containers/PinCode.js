import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardText
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { CardTitle, PinCodeInput } from '../components/Common';

class PinCode extends PureComponent {

  handlePinCodeInputed = () => {
    this.props.history.push('/player_type');
  }

  render() {
    return (
      <Card>
        <CardBody>
          <CardTitle>Pin Code</CardTitle>
          <PinCodeInput fields={4} />
          <CardText>Note: All people with the same Pin Code will join the same group</CardText>
          <Button
            block
            color='primary'
            onClick={this.handlePinCodeInputed}>
            Next
          </Button>
        </CardBody>
      </Card>
    );
  }
}

export default withRouter(PinCode);
