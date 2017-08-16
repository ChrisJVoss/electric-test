const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
const SimplePeer = require('simple-peer')

const publicPath = path.join(__dirname, 'public')
const staticMiddleware = express.static(publicPath)

let connections = []

app.use(staticMiddleware)

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

http.listen(3000, () => {
  console.log('Listening on 3000.')
})
