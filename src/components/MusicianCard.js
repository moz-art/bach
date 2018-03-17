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
  INSTRUMENT_IMGS,
  INSTRUMENT_TEXT
} from '../constants/Instruments';
import musicianImg from '../images/musician.jpg';


const InstrumentImg = ({ instrument, ...rest}) => {
  return (<CardImg  maxHeight='500px' src={INSTRUMENT_IMGS[instrument]} {...rest} />);
}

class MusicianCard extends PureComponent {

  static propTypes = {
    activeChannelIndex: PropTypes.number,
    note: PropTypes.object,
    instruments: PropTypes.array,
    title: PropTypes.string
  };

  static defaultProps = {
    activeChannelIndex: 0,
    title: ''
  };

  renderBackground() {
    const { activeChannelIndex, instruments } = this.props;
    if (instruments) {
      const data = instruments.find((data) => (data.channel === activeChannelIndex));
      console.log('activeChannel', activeChannelIndex, data.instruments[0]);
      const alt = INSTRUMENT_TEXT[data.instruments[0]];
      return (
        <InstrumentImg width='100%' instrument={data.instruments[0]} alt={alt} />
      );
    } else {
      return (<CardImg maxHeight='500px' width='100%' src={musicianImg} alt='musician' />);
    }
  }

  renderInstrumentText() {
    const { instruments, title } = this.props;
    if (!instruments || !instruments.length) {
      return title;
    }
    const instrumentsText = instruments.map((data) => {
      return `${INSTRUMENT_TEXT[data.instruments[0]]}(${data.channel + 1})`;
    }).join(', ');
    return `${title} - ${instrumentsText}`;
  }

  render() {
    const { note } = this.props;

    return (
      <CenteredCard maxWidth='500px' inverse>
        {this.renderBackground()}
        <CenteredImgOverlay>
          <CardTitle>{this.renderInstrumentText()}</CardTitle>
          <NoteText sharp={note && note.sharp} octave={note && note.octave}>
            {note ? note.base : ''}
          </NoteText>
        </CenteredImgOverlay>
      </CenteredCard>
    );
  }
}

export default MusicianCard;
