import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { CardTitle } from 'reactstrap';
import {
  CardImg,
  CenteredCard,
  CenteredImgOverlay,
  NoteText
} from './Common';
import {
  INSTRUMENTS,
  INSTRUMENT_IMGS,
  INSTRUMENT_TEXT
} from '../constants/Instruments';
import musicianImg from '../images/musician.jpg';


const InstrumentImg = ({ instrument, ...rest}) => {
  return (<CardImg  maxHeight='500px' src={INSTRUMENT_IMGS[instrument]} {...rest} />);
}

class MusicianCard extends PureComponent {

  static propTypes = {
    activeInstrumentIndex: PropTypes.number,
    note: PropTypes.string,
    instruments: PropTypes.arrayOf(PropTypes.oneOf(INSTRUMENTS)),
    title: PropTypes.string
  };

  static defaultProps = {
    activeInstrumentIndex: 0,
    title: ''
  };

  renderBackground() {
    const { activeInstrumentIndex, instruments } = this.props;
    if (instruments) {
      const intrument = instruments[activeInstrumentIndex];
      return (<InstrumentImg width='100%' instrument={intrument} alt={intrument} />);
    } else {
      return (<CardImg maxHeight='500px' width='100%' src={musicianImg} alt='musician' />);
    }
  }

  renderInstrumentText() {
    const { instruments, title } = this.props;
    if (!instruments || !instruments.length) {
      return title;
    }
    const instrumentsText = instruments.map((i) => (INSTRUMENT_TEXT[i])).join(', ');
    return `${title} - ${instrumentsText}`;
  }

  render() {
    const { note } = this.props;

    return (
      <CenteredCard maxWidth='500px' inverse>
        {this.renderBackground()}
        <CenteredImgOverlay>
          <CardTitle>{this.renderInstrumentText()}</CardTitle>
          <NoteText>{note}</NoteText>
        </CenteredImgOverlay>
      </CenteredCard>
    );
  }
}

export default MusicianCard;
