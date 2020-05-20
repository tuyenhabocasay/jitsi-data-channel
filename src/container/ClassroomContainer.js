import React from 'react'
import JitsiService, { eventNames } from '../services/jitis-service'
import './style.css'
import Jitsi from 'react-jitsi'
class ClassroomContainer extends React.Component {
  constructor (props) {
    super(props)
    this.JitsiMeetAPI = null
    this.state = {
      message: {}
    }
  }
  handleSend = () => {
    this._send("Hello world");
  }
  _onAPILoad = JitsiMeetAPI => {
    console.log('init jitsi')
    this.JitsiMeetAPI = JitsiMeetAPI
    this.JitsiMeetAPI.addEventListener(
      'endpointTextMessageReceived',
      this._onMessage
    )
  }
  _onMessage = data => {
    // To do here when recieving message
    console.log('message comming')
    console.log(data)
    this.setState({message: data})
  }
  _send = data => {
    return this.JitsiMeetAPI.executeCommand('sendEndpointTextMessage', '', data)
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
          <button onClick={this.handleSend}>Send data</button>
        </div>
        <Jitsi
          roomName={'tuyenha'}
          displayName={'Tuyen Ha'}
          password={''}
          config={{
            openBridgeChannel: true
          }}
          onAPILoad={this._onAPILoad}
        />
      </div>
    )
  }
}

export default ClassroomContainer
