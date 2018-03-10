import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardText
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import {
  API_EVENTS,
  PAGE_URL,
  ROLE_TYPE
} from '../constants/Constant';
import {
  CardHeader,
  LoadingMask,
  PinCodeInput
} from '../components/Common';
import ServerAPI from '../ws/ServerAPI';

class PinCode extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      code: '',
      loadingMessage: null
    };
  }

  componentDidMount() {
    ServerAPI.on(API_EVENTS.OPENED, this.handleServerOpened);
    ServerAPI.on(API_EVENTS.GROUP_JOINED, this.handleGroupJoined);
  }

  componentWillUnmount() {
    ServerAPI.off(API_EVENTS.OPENED, this.handleServerOpened);
    ServerAPI.off(API_EVENTS.GROUP_JOINED, this.handleGroupJoined);
  }

  handleServerOpened = () => {
    // the loading message means the user already clicks the submit button.
    if (!this.state.loadingMessage) {
      return;
    }

    this.setState({
      loadingMessage: 'Joining to a group'
    }, () => {
      ServerAPI.joinGroup(this.state.code);
    });
  }

  handleGroupJoined = (group) => {
    this.setState({ loadingMessage: null }, () => {
      if (group.hasConductor) {
        ServerAPI.requestRole(ROLE_TYPE.MUSICIAN)
        this.props.history.push({
          pathname: PAGE_URL.MUSICIAN,
          state: { code: this.state.code, group }
        });
      } else {
        this.props.history.push({
          pathname: PAGE_URL.ROLE_SELECTOR,
          state: { code: this.code }
        });
      }

    });
  }

  handlePinCodeInputed = () => {
    document.activeElement.blur();
    // put the code back to render the react-code-input correctly.
    this.setState({
      code: this.code,
      loadingMessage: 'Connecting to Server'
    }, () => {
      if (!ServerAPI.ready) {
        ServerAPI.connect();
      } else {
        this.handleServerOpened();
      }
    });
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
        <CardHeader>Group Code</CardHeader>
        <CardBody>
          <PinCodeInput
            disabled={!!loadingMessage}
            fields={4}
            type='number'
            value={code}
            onChange={this.handleCodeChanged} />
          <CardText>Note: All people with the same Group Code will be the same group</CardText>
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
