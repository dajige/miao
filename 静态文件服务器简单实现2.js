const http = require('http')
const fs = require('fs')
const path = require('path')
const fsp = fs.promises
const dir = '/user/MacBok/a'

const server = http.createServer()
server.on('request', (req, res) => {
  var url = decodeURIComponent(req.url)
  console.log(req.method, url)
  const targetpath = path.join(dir, url)
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
server.listen(8000)
