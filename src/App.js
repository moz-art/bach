import React, { PureComponent } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import MozartHeader from './components/MozartHeader';
import Conductor from './containers/Conductor';
import Musician from './containers/Musician';
import PinCode from './containers/PinCode';
import PlayerType from './containers/PlayerType';

class App extends PureComponent {
  render() {
    return (
      <BrowserRouter>
        <section>
          <MozartHeader />
          <Route exact path='/' component={PinCode} />
          <Route path='/player_type' component={PlayerType} />
          <Route path='/conductor' component={Conductor} />
          <Route path='/musician' component={Musician} />
        </section>
      </BrowserRouter>
    );
  }
}

export default App;
