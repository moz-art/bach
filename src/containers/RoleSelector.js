import React, { PureComponent } from 'react';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import {
  API_EVENTS,
  PAGE_URL,
  ROLE_TYPE
} from '../constants/Constant';
import { LoadingMask } from '../components/Common';
import RoleCard from '../components/RoleCard';
import ServerAPI from '../ws/ServerAPI';

class PlayerType extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loadingMessage: null
    };
  }

  componentDidMount = () => {
    const { location, history } = this.props;
    if (!location.state || !location.state.code || !ServerAPI.ready) {
      // no code no show.
      history.replace(PAGE_URL.PIN_CODE);
      return;
    }
    ServerAPI.on(API_EVENTS.ROLE_RESULT, this.handleRoleConfirmed);
  }

  componentWillUnmount() {
    ServerAPI.off(API_EVENTS.ROLE_RESULT, this.handleRoleConfirmed);
  }

  handleRoleConfirmed = (role, group) => {
    this.setState({ loadingMessage: null }, () => {
      const { history, location } = this.props;
      const code = location.state.code;
      switch (role) {
        case ROLE_TYPE.CONDUCTOR:
          history.push({
            pathname: PAGE_URL.CONDUCTOR,
            state: { code, group }
          });
          break;
        case ROLE_TYPE.MUSICIAN:
          history.push({
            pathname: PAGE_URL.MUSICIAN,
            state: { code, group }
          });
          break;
        default:
          console.warn(`unknown role from server: ${role}`);
          return;
      }
    });
  }

  handlePlayerTypeChoosed = (e) => {
    const role = e.target.dataset.role;
    if (role !== ROLE_TYPE.CONDUCTOR && role !== ROLE_TYPE.MUSICIAN) {
      console.warn(`wrong player type got: ${role}`);
      return;
    }
    this.setState({
      loadingMessage: 'requesting'
    }, () => {
      ServerAPI.requestRole(role);
    });
  }

  render() {
    const { location } = this.props;
    if (!location.state || !location.state.code) {
      // no code no show.
      return null;
    }
    const code = location.state.code;
    const { loadingMessage } = this.state;
    return (
      <Card>
        {loadingMessage && <LoadingMask>{loadingMessage}</LoadingMask>}
        <CardHeader>
          Choose a role! (Room Code: {code})
        </CardHeader>
        <CardBody>
          <CardGroup>
            <RoleCard
              buttonColor='info'
              buttonText='Be a Conductor'
              description='A conductor chooses a song and conducts musicians to play the song.'
              name='Conductor'
              role={ROLE_TYPE.CONDUCTOR}
              onClick={this.handlePlayerTypeChoosed} />
            <RoleCard
              buttonColor='success'
              buttonText='Be a Musician'
              description='A musician plays instruments for everyone.'
              name='Musician'
              role={ROLE_TYPE.MUSICIAN}
              onClick={this.handlePlayerTypeChoosed} />
          </CardGroup>
        </CardBody>
      </Card>
    );
  }
}

export default withRouter(PlayerType);
