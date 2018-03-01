import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardText
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { PAGE_URL } from '../constants/Constant';
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
      loadingMessage: null
    };
  }

  handlePinCodeInputed = () => {
    document.activeElement.blur();
    // put the code back to render the react-code-input correctly.
    this.setState({
      code: this.code,
      loadingMessage: 'Connecting to Server'
    });
    setTimeout(() => {
      this.setState({ loadingMessage: null }, () => {
        this.props.history.push({
          pathname: PAGE_URL.ROLE_SELECTOR,
          state: { code: this.code }
        });
      });
    }, 1500);
  }

  handleCodeChanged = (code) => {
    // XXX
    // There is a defact on react-code-input. The focus jumps to first field if we set the value.
    // The workaround is to save the value at this scope and save to state when button clicked.
    this.code = code;
  }

  render() {
    const { code, loadingMessage } = this.state;
    return (
      <Card>
        {loadingMessage && <LoadingMask>{loadingMessage}</LoadingMask>}
        <CardHeader>Pin Code</CardHeader>
        <CardBody>
          <PinCodeInput
            disabled={!!loadingMessage}
            fields={4}
            type='number'
            value={code}
            onChange={this.handleCodeChanged} />
          <CardText>Note: All people with the same Pin Code will join the same group</CardText>
          <Button
            block
            color='primary'
            disabled={!!loadingMessage}
            onClick={this.handlePinCodeInputed}>
            Next
          </Button>
        </CardBody>
      </Card>
    );
  }
}

export default withRouter(PinCode);
