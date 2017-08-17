const privateKey = fs.readFileSync('../myCA/server_key.pem')
const certificate = fs.readFileSync('../myCA/server_crt.pem')

const express = require('express')
const app = express()
const https = require('https').createServer({
  key: privateKey,
  cert: certificate
}, app)
const io = require('socket.io')(https)
const path = require('path')

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

https.listen(3000, () => {
  console.log('Listening on 3000.')
})
