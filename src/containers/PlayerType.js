import React, { PureComponent } from 'react';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import RoleCard from '../components/RoleCard';

class PlayerType extends PureComponent {

  handlePlayerTypeChoosed = (e) => {
    const type = e.target.dataset.type;
    switch (type) {
      case 'conductor':
      case 'musician':
        this.props.history.push(`/${type}`);
        break;
      default:
        console.warn(`wrong player type got: ${type}`);
    }
  }

  render() {
    return (
      <Card>
        <CardHeader>
          Be what you want!
        </CardHeader>
        <CardBody>
          <CardGroup>
            <RoleCard
              buttonColor='info'
              buttonText='Be a Conductor'
              description='A conductor chooses a song and conducts musicians to play the song.'
              name='Conductor'
              type='conductor' />
            <RoleCard
              buttonColor='success'
              buttonText='Be a Musician'
              description='A musician plays instruments for everyone.'
              name='Musician'
              type='musician' />
          </CardGroup>
        </CardBody>
      </Card>
    );
  }
}

export default withRouter(PlayerType);
