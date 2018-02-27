import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardImg,
  CardImgOverlay,
  CardText,
  CardTitle
} from 'reactstrap';
import styled from 'styled-components';
import conductorImg from '../images/conductor.png';
import musicianImg from '../images/musician.jpg';

const StyledCardImgOverlay = styled(CardImgOverlay)`
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
`;

const StyledCardText = styled(CardText)`
  flex: 1 1 auto;
`;

const StyledCard = styled(Card)`
  margin: 10px;
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
    const img = type === 'conductor' ? conductorImg : musicianImg;
    return (
      <StyledCard inverse>
        <CardImg width='100%' src={img} alt={description} />
        <StyledCardImgOverlay>
          <CardTitle>{name}</CardTitle>
          <StyledCardText>{description}</StyledCardText>
          <Button block color={buttonColor} size='lg' onClick={onClick}>{buttonText}</Button>
        </StyledCardImgOverlay>
      </StyledCard>
    );
  }
}

export default RoleCard;
