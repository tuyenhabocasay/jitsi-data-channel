# Guide

# Step 1: Import jitsi service and eventNames into component

import JitsiService, { eventNames } from '../services/jitis-service'

# Step 2: Define options

const options = {
"roomName": "roomId",
"width": 500,
"height": 500,
"parentNode": document.querySelector('#divId),
"userInfo": {
"email": "hatontuyen@gmail.com", // user email
"displayName": "Tuyen Ha" // user display name
}
}

# Step 3: Init jitsi service instance in componentdidmount to open or join conference

this.jitsiService = new JitsiService(options)

# Step 4: Add event listener for "videoConferenceJoined" event. This event is fired when local user has joined the conference

this.jitsiService.on(eventNames.videoConferenceJoined, data => {
    console.log('I am joined')
})

# Note: The data has following format:

{
    roomName: string, // the room name of the conference
    id: string, // the id of the local participant
    displayName: string, // the display name of the local participant
    avatarURL: string // the avatar URL of the local participant
}

# Step 5: Add event listener for "message" event. This event is fired when there is message comming
this.jitsiService.on(eventNames.message, data => {
    console.log(data)
})
# Note : the comming data has following format:
{
    "data": {
        "senderInfo": {
            "jid": "tuyenha@conference.meetsv-dev.1on1english.vn/18c29dba",
            "id": "18c29dba"
        },
        "eventData": {
            "name": "endpoint-text-message",
            "text": "hello"
        }
    }
}

# To send data to people in room use this method:
this.jitsiService.sendAll(data) // send to all people in that room
this.jitsiService.send(participantId, data) // send to one specific person in that room

# Note: data to be sent has format as a string or an JSON object. Example:
this.jitsiService.sendAll("Hello world") or this.jitsiService.sendAll({type: 'NEXT_SLIDE'})

# To get all participants excluding current user, try:
this.jitsiService.participants // an array of user object {id, displayName, displayFormatName}
