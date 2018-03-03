import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  CardImg,
  CardTitle
} from 'reactstrap';
import {
  FullSizeCardText,
  MarginedCard,
  StyledCardImgOverlay
} from './Common';
import conductorImg from '../images/conductor.png';
import musicianImg from '../images/musician.jpg';

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
      <MarginedCard inverse>
        <CardImg width='100%' src={img} alt={description} />
        <StyledCardImgOverlay>
          <CardTitle>{name}</CardTitle>
          <FullSizeCardText>{description}</FullSizeCardText>
          <Button block color={buttonColor} size='lg' data-type={type} onClick={onClick}>{buttonText}</Button>
        </StyledCardImgOverlay>
      </MarginedCard>
    );
  }
}

export default RoleCard;
