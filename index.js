const io = require('socket.io-client')

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: false
})
.then(function(stream) {
  const socket = io()
  const Peer = require('simple-peer')
  const wrtc = require('wrtc')
  const peer = new Peer({
    initiator: location.hash === '#init',
    config: {
      iceServers: [
        { url: 'stun:stun.l.google.com:19302' },
        { url: 'stun:stun1.l.google.com:19302' },
        { url: 'stun:stun2.l.google.com:19302' },
        { url: 'stun:stun.services.mozilla.com' },
        { url: 'stun:stun3.l.google.com:19302' },
        { url: 'stun:stun4.l.google.com:19302' },
        { url: 'turn:165.227.4.226:3478', username: 'chris', credential:'ilovecode' }
      ]
     },
    trickle: true,
    stream: stream,
    wrtc: wrtc
  })

  peer.on('signal', function(data) {
    socket.emit('yourId', data)
    console.log(data)
  })
  socket.on('otherId', id => {
    peer.signal(JSON.stringify(id))
    console.log(id)
  })

  peer.on('stream', function(stream) {
    const video = document.createElement('video')
    document.body.appendChild(video)
    video.src = window.URL.createObjectURL(stream)
    video.play()
  })
})
.catch(function(err) {
  console.log(err)
})
