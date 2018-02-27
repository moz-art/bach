import React, { PureComponent } from 'react';
import { Button } from 'reactstrap';
import { withRouter } from 'react-router-dom'

class PlayerType extends PureComponent {

  handlePlayerTypeChoosed = (e) => {
    const type = e.target.dataset.type;
    switch (type) {
      case 'conductor':
      case 'musician':
        this.props.history.push(`/${type}`);
        break;
      default:
        console.warn(`wrong player type got: ${type}`);
    }
  }

  render() {
    return (
      <section>
        Please select what you want to be!!
        <Button data-type='conductor' color='info' onClick={this.handlePlayerTypeChoosed}>
          Conductor
        </Button>
        <Button data-type='musician' color='success' onClick={this.handlePlayerTypeChoosed}>
          Musician
        </Button>
      </section>
    );
  }
}

export default withRouter(PlayerType);
