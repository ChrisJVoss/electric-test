const express = require('express')
const pem = require('pem')
pem.createCertificate({days: 1, selfSigned: true }, function(err, keys){
  const app = express()
  const path = require('path')
  const publicPath = path.join(__dirname, 'public')
  const staticMiddleware = express.static(publicPath)
  app.use(staticMiddleware)
  https.createServer({key: keys.serviceKey, cert: keys.certificate}, app).listen(3000, () => {
    console.log('Listening on 3000')
  })
  const io = require('socket.io')(https)
  const SimplePeer = require('simple-peer')

  let connections = []

  io.on('connection', socket => {
    connections.push(socket)
    console.log('%s users connected', connections.length)
    socket.on('yourId', (id) => {
      socket.broadcast.emit('otherId', id)
      console.log(id)
    })
    socket.on('disconnect', function() {
      connections.splice(connections.indexOf(socket), 1)
      console.log('%s users connected', connections.length)
    })
  })
})
