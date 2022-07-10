const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const http = require('http')
const { url } = require('inspector')
const port = 8000
var server = http.createServer()
const dir = '/MacBok/交作业的'

server.on('request', async (req, res) => {
  const targetpath = path.join(dir, req.url)
  try {
    var stat = await fsp.stat(targetpath)
    if (stat.isFile()) {
      var date = await fsp.readFile(targetpath)
      res.write(date)
      res.end()
    } else if (stat.isDirectory()) {
      if (url.at(-1) == '/') {
        var indexdir = path.join(targetpath, 'index.html')
        try {
          var indexstat = await fsp.stat(indexdir)
          if (indexstat.isFile()) {
            var indexContent = await fsp.readFile(indexdir)
            res.writeHead(200, {
              'content-Type': 'text/html;charset=UTF-8',
            })
            res.write(indexContent)
            res.end()
          } else {
            throw 'index is not a file'
          }
        } catch (e) {
          var entries = await fsp.readdir(targetpath, { withFileTypes: true })
          res.writeHead(200, {
            'Content-Type': 'text/html;charset=UTF-8',
          })
          res.write('<ul>')
          for (let entry of entries) {
            let slash = entry.isDirectory() ? '/' : ''
            res.write(
              `<li><a href = ${entry.name}${slash}>${entry.name}${slash}</a></li>`,
            )
          }
          res.write('</ul>')
          res.end()
        }
      } else {
        res.writeHead(302, {
          location: req.url + '/',
        })
        res.end()
      }
    } else {
      throw 'not file'
    }
  } catch (e) {
    res.write(404)
    res.end()
  }
})

server.listen(port)
