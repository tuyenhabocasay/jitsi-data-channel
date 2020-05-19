const domain = 'meetsv-dev.1on1english.vn'
const EventEmitter = require('events')
const defaultOptions = {
  roomName: 'tuyenha',
  width: 500,
  height: 500,
  parentNode: null,
  configOverwrite: { openBridgeChannel: true },
  interfaceConfigOverwrite: {
    filmStripOnly: true
  },
  userInfo: {
    email: Date.now() + '@gmail.com',
    displayName: Date.now(),
    role: Date.now()
  }
}

export const eventNames = {
  participantJoined: 'participantJoined',
  sendEndpointTextMessage: 'sendEndpointTextMessage',
  endpointTextMessageReceived: 'endpointTextMessageReceived',
  participantLeft: 'participantLeft',
  participantKickedOut: 'participantKickedOut',
  videoConferenceJoined: 'videoConferenceJoined',
  cameraError: 'cameraError',
  micError: 'cameraError',
  participantJoined: 'participantJoined',
  message: 'message',
  mediaError: 'mediaError'
}

class JitsiService extends EventEmitter {
  constructor (options = {}) {
    super()
    this.api = new window.JitsiMeetExternalAPI(domain, {
      ...defaultOptions,
      ...options
    })
    this.participants = []
    this.api.addEventListener(eventNames.participantJoined, data => {
      this.emit(eventNames.participantJoined, data)
      this.participants.push(data)
    })
    this.onMessage = () => {}
    this.api.addEventListener(eventNames.endpointTextMessageReceived, data => {
      this.emit(message.message, data)
    })
    this.api.addEventListener(eventNames.participantLeft, data => {
      this.leave(data.id)
    })
    this.api.addEventListener(eventNames.participantKickedOut, data => {
      this.leave(data.id)
    })
    this.api.addEventListener(eventNames.videoConferenceJoined, data => {
      this.emit(eventNames.videoConferenceJoined, data)
    })
    this.api.addEventListeners({
      [eventNames.cameraError]: data => this.emit(eventNames.mediaError, data),
      [eventNames.micError]: data => this.emit(eventNames.mediaError, data)
    })
  }
  leave = id => {
    const index = this.participants.findIndex(item => item.id === id)
    this.participants.splice(index, 1)
  }
  send = (participantId = '', data) => {
    this.api.executeCommand(eventNames.sendEndpointTextMessage, participantId, data)
  }
  sendAll = data => {
    this.api.executeCommand(eventNames.sendEndpointTextMessage, '', data)
  }
  removeListeners = () => {
    this.api.removeEventListeners(Object.values(eventNames))
  }
  dispose = () => {
    this.api.dispose()
  }
}

export default JitsiService
