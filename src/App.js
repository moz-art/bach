import React, { PureComponent } from 'react';
import { Button } from 'reactstrap';
import MozartHeader from './components/MozartHeader';

class App extends PureComponent {
  render() {
    return (
      <section>
        <MozartHeader />
        <Button color='info'>Conductor</Button>
        <Button color='success'>Player</Button>
      </section>
    );
  }
}

export default App;
