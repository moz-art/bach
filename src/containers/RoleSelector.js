import React, { PureComponent } from 'react';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { PAGE_URL, ROLE_TYPE } from '../constants/Constant';
import RoleCard from '../components/RoleCard';

class PlayerType extends PureComponent {

  componentDidMount = () => {
    if (!this.props.location.state || !this.props.location.state.code) {
      // no code no show.
      this.props.history.replace(PAGE_URL.PIN_CODE);
      return;
    }
  }

  handlePlayerTypeChoosed = (e) => {
    const type = e.target.dataset.type;
    const code = this.props.location.state.code;
    switch (type) {
      case ROLE_TYPE.CONDUCTOR:
        this.props.history.push({
          pathname: PAGE_URL.CONDUCTOR,
          state: { code }
        });
        break;
      case ROLE_TYPE.MUSICIAN:
        this.props.history.push({
          pathname: PAGE_URL.MUSICIAN,
          state: { code }
        });
        break;
      default:
        console.warn(`wrong player type got: ${type}`);
    }
  }

  render() {
    if (!this.props.location.state || !this.props.location.state.code) {
      // no code no show.
      return null;
    }
    const code = this.props.location.state.code;
    return (
      <Card>
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
              type={ROLE_TYPE.CONDUCTOR}
              onClick={this.handlePlayerTypeChoosed} />
            <RoleCard
              buttonColor='success'
              buttonText='Be a Musician'
              description='A musician plays instruments for everyone.'
              name='Musician'
              type={ROLE_TYPE.MUSICIAN}
              onClick={this.handlePlayerTypeChoosed} />
          </CardGroup>
        </CardBody>
      </Card>
    );
  }
}

export default withRouter(PlayerType);
