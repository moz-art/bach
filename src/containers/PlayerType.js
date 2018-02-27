import React, { PureComponent } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row
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
        <CardBody>
          <CardTitle>
            Be what you want!
          </CardTitle>
          <Row>
            <Col xs='12' sm='6'>
              <RoleCard
                buttonColor='info'
                buttonText='Be a Conductor'
                description='A conductor can choose a song and conduct the musician to play music.'
                name='Conductor'
                type='conductor' />
            </Col>
            <Col xs='12' sm='6'>
              <RoleCard
                buttonColor='success'
                buttonText='Be a Musician'
                description='A musician will play some instruments.'
                name='Musician'
                type='musician' />
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default withRouter(PlayerType);
