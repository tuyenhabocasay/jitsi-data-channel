import React from 'react'
import JitsiService, { eventNames } from '../services/jitis-service'
import './style.css'
class ClassroomContainer extends React.Component {
  constructor (props) {
    super(props)
    this.jitsiService = undefined
    this.users = []
    this.state = {
      isReadyRtcDevices: true,
      users: [],
      message: undefined,
      isExist: false,
      role: ''
    }
  }
  componentDidMount () {
    this.jitsiService = new JitsiService({
      parentNode: document.querySelector('#conf'),
      userInfo: {
        displayName: Date.now(),
        email: Date.now() + '@gmail.com'
      }
    })
    this.jitsiService.on(eventNames.videoConferenceJoined, data => {
      /*
      data = {
        roomName: string, // the room name of the conference
        id: string, // the id of the local participant
        displayName: string, // the display name of the local participant
        avatarURL: string // the avatar URL of the local participant
      }
      */
      console.log('I am joined')
    })
    this.jitsiService.on(eventNames.message, data => {
      /*
       {
            "data": {
                "senderInfo": {
                    "jid": string,
                    "id": string
                },
                "eventData": {
                    "name": "endpoint-text-message",
                    "text": string or JSON object
                }
            }
        }
      */
      console.log('message comming')
      this.setState({ message: data })
    })
    this.jitsiService.on(eventNames.mediaError, data => {
      /** 
       data =  {
      type: string, // A constant representing the overall type of the error.
      message: string // Additional information about the error.
      }
       */
      this.setState({
        isReadyRtcDevices: false
      })
    })
  }
  componentWillUnmount () {
    this.jitsiService.removeListeners();
    this.jitsiService.dispose()
  }
  handleGetUsers = () => {
    this.setState({ participants: this.jitsiService.participants })
  }
  handleSend = () => {
    this.jitsiService.sendAll({ type: 'test', label: 'hello world' })
  }

  handleGetDevices = async ()=>{
   const devices = await this.jitsiService.api.getCurrentDevices();
   console.log(devices)
  }  
  handleToggleAudio = ()=>{
    this.jitsiService.api.executeCommand('toggleAudio');
  }
  render () {
    return (
      <div className='VC-grid-container'>
        <div className='VC-grid-item' id='annotation'>
          <p>
            Participants:
            <br /> {JSON.stringify(this.state.participants)}
          </p>
          <p>
            Message cooming:
            <br /> {JSON.stringify(this.state.message)}
          </p>
          <button onClick={this.handleGetUsers}>Get all users</button>
          <button onClick={this.handleSend}>Send data</button>
          <button onClick={this.handleGetDevices}>Get all devices</button>
          <button onClick={this.handleToggleAudio}>Mute audio</button>
        </div>
        <div className='VC-grid-item' id='conf'></div>
      </div>
    )
  }
}

export default ClassroomContainer
