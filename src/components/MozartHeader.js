import React from 'react';
import styled from 'styled-components';
import { Navbar, NavbarBrand } from 'reactstrap';
import gclef from '../images/gclef.png';

const StyledNavbar = styled(Navbar)`
  max-height: 80px;
  justify-content: center;
`;
const MozartBrand = styled(NavbarBrand)`
  font-family: 'IM Fell English SC', serif;
  font-style: italic;
  font-weight: 300;
  line-height: 1.5;
  padding-left: 22px;
  background-image: url('${gclef}');
  background-size: auto 100%;
  background-repeat: no-repeat;
`;

export default (props) => {
  return (
    <StyledNavbar light>
      <MozartBrand>Mozart</MozartBrand>
    </StyledNavbar>
  );
};

