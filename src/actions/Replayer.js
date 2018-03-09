export default (midiFile, midiPlayer) => {
  var trackStates = [];
  var beatsPerMinute = 120;
  var ticksPerBeat = midiFile.header.ticksPerBeat;
  var speed = 1;
  var nextEventInfo;
  var secondsToNextEvent = -1;
  var stop = false;
  var playing = false;
  var activeChannels = null;

  var allOrderedEvents = [];
  for (var i = 0; i < midiFile.tracks.length; i++) {
    trackStates[i] = {
      'nextEventIndex': 0,
      'ticksToNextEvent': (
        midiFile.tracks[i].length ?
          midiFile.tracks[i][0].deltaTime :
          null
      )
    };
  }

  function prepareOrderedEvents() {
    var hasMoreEvent = true;
    while (hasMoreEvent) {
      var ticksToNextEvent = null;
      var nextEventTrack = null;
      var nextEventIndex = null;
      for (var i = 0; i < trackStates.length; i++) {
        if (
          trackStates[i].ticksToNextEvent != null
          && (ticksToNextEvent == null || trackStates[i].ticksToNextEvent < ticksToNextEvent)
        ) {
          ticksToNextEvent = trackStates[i].ticksToNextEvent;
          nextEventTrack = i;
          nextEventIndex = trackStates[i].nextEventIndex;
        }
      }
      if (nextEventTrack != null) {
        /* consume event from that track */
        var nextEvent = midiFile.tracks[nextEventTrack][nextEventIndex];
        var nextNextEvent = midiFile.tracks[nextEventTrack][nextEventIndex + 1];
        if (nextNextEvent) {
          trackStates[nextEventTrack].ticksToNextEvent += nextNextEvent.deltaTime;
        } else {
          trackStates[nextEventTrack].ticksToNextEvent = null;
        }
        trackStates[nextEventTrack].nextEventIndex += 1;
        // Todo : We could add timeline information for each event.
        //        So that we may synchronize the playback by sending current playing time to each client.
        nextEventInfo = {
          'ticksToEvent': ticksToNextEvent,
          'event': nextEvent,
          'track': nextEventTrack
        }
        allOrderedEvents.push(nextEventInfo);
      } else {
        hasMoreEvent = false;
        nextEventInfo = null;
      }
    }
    // ************　Debug purpose　************ //
    // console.log('TOTAL event length : ' + allOrderedEvents.length);
    // for (var i = 0; i < allOrderedEvents.length; i++) {
    //   var eventInfo = allOrderedEvents[i];
    //   console.log('Event track : ' + eventInfo['track'] + '/event.channel : ' + eventInfo['event'].channel + ', TTE : ' + eventInfo['ticksToEvent']);
    // }

    // Reverse it, so that the first-played event should be at the tail of list.
    allOrderedEvents.reverse();
  }

  var lastTick2Event = 0;
  function getNextEvent() {
    var ticksToNextEvent = null;
    nextEventInfo = allOrderedEvents.pop();
    if (nextEventInfo) {
      // Todo : We could filter out unwanted channel event to reduce the unnecessary timeout.
      ticksToNextEvent = nextEventInfo['ticksToEvent'] - lastTick2Event;
      lastTick2Event = nextEventInfo['ticksToEvent'];
      var beatsToNextEvent = ticksToNextEvent / ticksPerBeat;
      secondsToNextEvent = beatsToNextEvent / (beatsPerMinute / 60);
    } else {
      nextEventInfo = null;
      secondsToNextEvent = -1;
      finish();
    }
  }

  function finish() {
    self.finished = true;
    midiPlayer.stopAllNotes && midiPlayer.stopAllNotes();
    if (self.finishedCallback) {
      self.finishedCallback();
    }
  }

  prepareOrderedEvents();
  getNextEvent();

  function scheduleNextTimer() {
    if (stop) {
      finish();
      return;
    }

    if (secondsToNextEvent < 0) {
      return;
    }
    // flush first event
    handleEvent();
    getNextEvent();
    if (secondsToNextEvent < 0) {
      return;
    }

    // flush more events
    while(secondsToNextEvent === 0) {
      handleEvent();
      getNextEvent();
    }

    if (secondsToNextEvent < 0) {
      return;
    }
    var nTimeSpan = secondsToNextEvent * 1000 * speed;
    window.setTimeout(scheduleNextTimer, nTimeSpan);
  }

  function handleEvent() {
    var event = nextEventInfo.event;
    switch (event.type) {
      case 'meta':
        // if (event.subtype === 'setTempo') {
        //   beatsPerMinute = 60000000 / event.microsecondsPerBeat
        // }
        break;
      case 'channel':
        if (activeChannels !== null && activeChannels !== undefined &&
            activeChannels.indexOf(event.channel) === -1) {
          return;
        }
        switch (event.subtype) {
          case 'noteOn':
            midiPlayer.noteOn(event.channel, event.noteNumber, event.velocity, 0);
            break;
          case 'noteOff':
            midiPlayer.noteOff(event.channel, event.noteNumber, 0);
            break;
          case 'programChange':
            midiPlayer.programChange(event.channel, event.programNumber);
            break;
          default:
        }
        break;
      default:
    }
  }

  function replay() {
    playing = true;
    scheduleNextTimer();
  }

  function stopPlaying() {
    stop = true;
  }

  function isPlaying() {
    return playing;
  }

  function changeSpeed(bpm) {
    if (bpm < 10) {
      return;
    }

    beatsPerMinute = bpm;
    console.log('bpm: ', bpm);
  }

  function setActiveChannels(channels) {
    activeChannels = channels;
  }

  function getSpeed() {
    return beatsPerMinute;
  }

  var self = {
    'setActiveChannels': setActiveChannels,
    'setSpeed': changeSpeed,
    'getSpeed': getSpeed,
    'replay': replay,
    'stop': stopPlaying,
    'finished': false,
    'finishedCallback': null,
    'isPlaying': isPlaying
  };
  return self;
}
