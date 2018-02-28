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

## API from Mozart to Bach

* joinGroup: the result of the `joinGroup` request. It ships with group information, for example:

```javascript
  {
    "event": "joinGroup",
    "group": {
      "hasConductor": false,
      "musicianCount": 1
    }
  }
```

* requestRole: the result of the `requestRole` request. The real role is returned with `role` field.

```javascript
  {
    "event": "requestRole",
    "role": "musician"
  }
```

* trackInfo: trackInfo is the event when the conductor click `start` button. All group members receives this event, but conductor will receive the empty result in channels. An example looks like:

```javascript
  {
    "event": "trackInfo",
    "data": { "name": "bumblebee" },
    "channels": [ "acoustic_grand_piano", "violin" ]
  }
```

* groupChanged: groupChanged is the event when a musician or conductor is joined to this group or a musician is left from this group. An example looks like:

```javascript
  {
    "event": "groupChanged",
    "group": {
      "hasConductor": false,
      "musicianCount": 2
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
    "note": 94,
    "velocity": 1
  }
```

* noteOff: noteOff is the event to tell this UI to mute a note. An example looks like:

```javascript
  {
    "event": "noteOff",
    "note": 94
  }
```
