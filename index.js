var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({ server: server })
console.log("websocket server created")

wss.on("connection", function (ws) {
  var id = setInterval(function () {
    ws.send(JSON.stringify(new Date()), function () { })
  }, 1000)
  console.log("websocket connection open")
  ws.send('welcome new cliente')

  ws.on('message', (message, isBinary) => {
    console.log('received: ' + message)
    // ws.send('got your message: ' + message)

    //all clientes
    wss.clients.forEach((client) => {
      client.send(message, { binary: isBinary });
    });

    //all clientes, excluding sender.
    // wss.clients.forEach((client) => {
    //     if (client !== ws && client.readyState === WebSocket.OPEN) {
    //         client.send(data, { binary: isBinary });
    //     }
    // });
  })

  ws.on("close", function () {
    console.log("websocket connection close")
    clearInterval(id)
  })
})
