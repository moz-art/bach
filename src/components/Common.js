import React from 'react';
import styled from 'styled-components';
import {
  Card as BaseCard,
  CardHeader as BaseCardHeader,
  CardImg as BaseCardImg,
  CardImgOverlay as BaseImgOverlay,
  CardText as BaseCardText
} from 'reactstrap';
import CodeInput from 'react-code-input';
import loadingImg from '../images/loading.gif';

export const CardHeader = styled(BaseCardHeader)`
  text-align: center;
`;

export const PinCodeInput = (props) => {
  const Center = styled.section`
    text-align: center;

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  `;
  return (<Center><CodeInput {...props}/></Center>);
};

export const LoadingMask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);

  &:before {
    content: ' ';
    max-width: 120px;
    max-height: 120px;
    width: 50%;
    height: 50%;
    background-image: url('${loadingImg}');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100%;
  }
`;

export const StyledCardImgOverlay = styled(BaseImgOverlay)`
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
`;

export const CenteredImgOverlay = styled(StyledCardImgOverlay)`
  justify-content: center;
`;

export const FullSizeCardText = styled(BaseCardText)`
  flex: 1 1 auto;
`;

export const NoteText = styled(({sharp, octave, ...props}) => (<BaseCardText {...props} />))`
  align-self: center;
  text-align: center;
  margin-top: auto;
  &.card-text {
    margin-bottom: auto;
  }
  font-size: 96pt;
  position: relative;
  padding-right: 0.5em;

  &:before {
    content: '${props => props.octave}';
    position: absolute;
    right: 0;
    bottom: 0.1em;
    vertical-align: sub;
    font-size: 50%;
  }
  ${props => (
    !props.sharp ? '' : `
      &:after {
        content: '#';
        position: absolute;
        top: 0.1em;
        right: 0;
        vertical-align: super;
        font-size: 50%;
      }
    `
  )}
`;

export const Card = styled(({ maxHeight, maxWidth, ...props }) => (<BaseCard {...props} />))`
  ${props => props.maxHeight ? `max-height: ${props.maxHeight}` : ''}
  ${props => props.maxWidth ? `max-width: ${props.maxWidth}` : ''}
`;

export const CenteredCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`;

export const MarginedCard = styled(Card)`
  margin: 10px;
`;

export const CardImg = styled(({ maxHeight, maxWidth, ...props }) => <BaseCardImg {...props} />)`
  ${props => props.maxHeight ? `max-height: ${props.maxHeight}` : ''}
  ${props => props.maxWidth ? `max-width: ${props.maxWidth}` : ''}
`;
