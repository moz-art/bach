import React from 'react';
import styled from 'styled-components';
import { CardTitle as BaseCardTitle } from 'reactstrap';
import CodeInput from 'react-code-input';

export const CardTitle = styled(BaseCardTitle)`
  text-align: center;
`;

export const PinCodeInput = (props) => {
  const Center = styled.section`
    text-align: center;
  `;
  return (<Center><CodeInput {...props} /></Center>);
}
