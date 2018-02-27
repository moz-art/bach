import React, { PureComponent } from 'react';
import { Button, Navbar, NavbarBrand } from 'reactstrap';
import gclef from './images/gclef.png';

class App extends PureComponent {
  render() {
    return (
      <section>
        <Navbar light>
          <NavbarBrand><img alt='clef logo' src={gclef}/>Mozart</NavbarBrand>
        </Navbar>
        <Button color='info'>Conductor</Button>
        <Button color='success'>Player</Button>
      </section>
    );
  }
}

export default App;
