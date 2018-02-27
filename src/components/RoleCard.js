import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle
} from 'reactstrap';
import styled from 'styled-components';
import conductorImg from '../images/conductor.png';
import musicianImg from '../images/musician.jpg';

const StyledImg = styled.img`
  width: 100%;
  padding-bottom: 100%;
  max-width: 400px;
`;

const StyledConductorImg = styled(StyledImg)`
  background-image: url('${conductorImg}');
  background-size: 100%;
  background-position: 0, 0;
  background-repeat: no-repeat;
`;

const StyledMusicianImg = styled(StyledImg)`
  background-image: url('${musicianImg}');
`;

class RoleCard extends PureComponent {

  static propTypes = {
    buttonColor: PropTypes.string,
    buttonText: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.oneOf(['conductor', 'musician']).isRequired,
    onClick: PropTypes.func
  };

  render() {
    const {
      buttonColor,
      buttonText,
      description,
      name,
      type,
      onClick
    } = this.props;
    const Img = type === 'conductor' ? StyledConductorImg : StyledMusicianImg;
    return (
      <Card>
        <CardBody>
          <CardTitle>{name}</CardTitle>

          <Img/>
          <CardText>{description}</CardText>
          <Button color={buttonColor} block onClick={onClick}>{buttonText}</Button>
        </CardBody>
      </Card>
    );
  }
}

export default RoleCard;
