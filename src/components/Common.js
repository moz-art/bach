import React from 'react';
import styled from 'styled-components';
import { CardHeader as BaseCardHeader } from 'reactstrap';
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
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);

  &:after {
    content: ' ';
    width: 50%;
    height: 50%;
    background-image: url('${loadingImg}');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100%;
  }

`;
