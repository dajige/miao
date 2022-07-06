const http = require('http')
const fs = require('fs')
const path = require('path')
const fsp = fs.promises
const dir = '/MacBok/交作业的'

const server = http.createServer()
server.on('request', (req, res) => {
  const targetpath = path.join(dir, req.url)
  fs.readFile(targetpath, (err, date) => {
    if (err) {
      res.writeHead(400)
      res.write(String(err))
      res.end()
    } else {
      res.write(date)
      res.end()
    }
  })
})
server.listen(80)
