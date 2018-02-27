import React from 'react';
import styled from 'styled-components';
import { CardHeader as BaseCardHeader } from 'reactstrap';
import CodeInput from 'react-code-input';

export const CardHeader = styled(BaseCardHeader)`
  text-align: center;
`;

export const PinCodeInput = (props) => {
  const Center = styled.section`
    text-align: center;
  `;
  return (<Center><CodeInput {...props} /></Center>);
};
