import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardText
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import {
  CardHeader,
  LoadingMask,
  PinCodeInput
} from '../components/Common';

class PinCode extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      code: '',
      loading: false
    };
  }

  handlePinCodeInputed = () => {
    document.activeElement.blur();
    // put the code back to render the react-code-input correctly.
    this.setState({ loading: true, code: this.code });
    setTimeout(() => {
      this.setState({ loading: false }, () => {
        this.props.history.push({
          pathname: '/player_type',
          state: { code: this.code }
        });
      });
    }, 5000);
  }

  handleCodeChanged = (code) => {
    // XXX
    // There is a defact on react-code-input. The focus jumps to first field if We set the value.
    // The workaround is to save the value at this scope and save to state when button clicked.
    this.code = code;
  }

  render() {
    const { code, loading } = this.state;
    return (
      <Card>
        {loading && <LoadingMask />}
        <CardHeader>Pin Code</CardHeader>
        <CardBody>
          <PinCodeInput
            disabled={loading}
            fields={4}
            type='number'
            value={code}
            onChange={this.handleCodeChanged} />
          <CardText>Note: All people with the same Pin Code will join the same group</CardText>
          <Button
            block
            color='primary'
            disabled={loading}
            onClick={this.handlePinCodeInputed}>
            Next
          </Button>
        </CardBody>
      </Card>
    );
  }
}

export default withRouter(PinCode);
