import React, { PureComponent } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { PAGE_URL } from './constants/Constant';
import MozartHeader from './components/MozartHeader';
import Conductor from './containers/Conductor';
import Musician from './containers/Musician';
import PinCode from './containers/PinCode';
import RoleSelector from './containers/RoleSelector';

class App extends PureComponent {
  render() {
    return (
      <BrowserRouter>
        <section>
          <MozartHeader />
          <Route exact path={PAGE_URL.PIN_CODE} component={PinCode} />
          <Route path={PAGE_URL.ROLE_SELECTOR} component={RoleSelector} />
          <Route path={PAGE_URL.CONDUCTOR} component={Conductor} />
          <Route path={PAGE_URL.MUSICIAN} component={Musician} />
        </section>
      </BrowserRouter>
    );
  }
}

export default App;
