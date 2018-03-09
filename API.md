# API from Bach to Mozart

* joinGroup: joinGroup is the first step of UI flow. Bach sends this event with the group `code`. If a group with the `code` is already existed, server returns the group information. If a group is not created, server creates the group and sends the empty group information back.

``` javascript
  {
    "event": "joinGroup",
    "code": "code"
  }
```

* requestRole: requestRole is the event that UI sends to server to state the role of UI. The role can be `conductor` or `musician`. A group only has a single conductor. If the group already have the conductor, server should return `musician` in role field.

``` javascript
  {
    "event": "requestRole",
    "role": "conductor"
  }
```

* setSpeed: this API is used for telling server the current speed made by conductor.

``` javascript
  {
    "event": "setSpeed",
    "speed": 0.9 // this may be changed if we can support bpm.
  }
```

* setSong: this API is used for telling server which song we want to play.

``` javascript
  {
    "event": "setSong",
    "song": "bumblebee"
  }
```

* setVolume: this API is used for telling server the volumne of specific channel.

``` javascript
  {
    "event": "setVolume",
    "channel": 1,
    "volume": 0.7
  }
```

* start: this API is used for telling server to freeze the group and distribute instruments to all musicians.

``` javascript
  {
    "event": "start"
  }
```

* musicianReady: this API is used for telling conductor this musician is ready for playing, who already loaded all resources.

``` javascript
  {
    "event": "musicianReady"
  }
```

## API from Mozart to Bach

* joinGroup: the result of the `joinGroup` request. It ships with group information, for example:

```javascript
  {
    "event": "joinGroup",
    "group": {
      "hasConductor": false,
      "musicianCount": 1,
      "readyCount": 0
    }
  }
```

* requestRole: the result of the `requestRole` request. The real role is returned with `role` field.

```javascript
  {
    "event": "requestRole",
    "role": "musician",
    "group": {
      "song": "bumblebee",
      "hasConductor": false,
      "musicianCount": 1,
      "readyCount": 0
    }
  }
```

* trackInfo: trackInfo is the event when the conductor click `start` button. All group members receives this event, but conductor will receive the empty result in channels. An example looks like:

```javascript
  {
    "event": "trackInfo",
    "channels": [ "01", "02" ],
    "instruments": [ "acoustic_grand_piano", "violin" ],
    "group": {
      "song": "bumblebee",
      "hasConductor": true,
      "musicianCount": 1,
      "readyCount": 0,
      "volumns": [0.5, 0.5, 05, 0.5]
    }
  }
```

* groupChanged: groupChanged is the event when a musician or conductor is joined to this group or a musician is left from this group. An example looks like:

```javascript
  {
    "event": "groupChanged",
    "group": {
      "song": "bumblebee",
      "hasConductor": true,
      "musicianCount": 2,
      "readyCount": 1,
      "volumns": [0.5, 0.5, 0.7, 0.2]
    }
  }
```

* groupClosed: groupClosed is the event when the conductor is left from this group. The data of group is deleted from server. All UI should turn note off while receiving this event. An example looks like:

```javascript
  {
    "event": "groupClosed"
  }
```

* noteOn: noteOn is the event to tell this UI to play a note. An example looks like:

```javascript
  {
    "event": "noteOn",
    "notes": [{
      "note": 94,
      "velocity": 1
    }]
  }
```

* noteOff: noteOff is the event to tell this UI to mute a note. An example looks like:

```javascript
  {
    "event": "noteOff",
    "notes": [{
      "note": 94
    }]
  }
```

* songInfo: songInfo is the event to tell conductor the song information he/she chose.

```javascript
  {
    "event": "songInfo",
    "song": "bumblebee",
    "tracks": [['acoustic_grand_piano'], ['acoustic_grand_piano']]
    }
  }
```
