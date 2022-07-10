const http = require('http')
const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const mime = require('mime')

const server = http.createServer()

const port = 8000

const baseDir = '/MacBok/a'

// C:/Users/xieran/Desktop/yanzhao.png

// http://10.3.3.3:8899/aaa.js

server.on('request', async (req, res) => {
  req.url = path.posix.join(req.url)

  var urlObj = new URL(`http://xxx${req.url}`)

  console.log(req.method, decodeURIComponent(urlObj.pathname) + urlObj.search)

  const targetPath = path.join(baseDir, decodeURIComponent(urlObj.pathname))

  if (!targetPath.startsWith(baseDir)) {
    res.writeHead(404)
    res.write('404 Not Found')
    res.end()
    return
  }

  try {
    var stat = await fsp.stat(targetPath)
    if (stat.isFile()) {
      res.writeHead(200, {
        'Content-Type': mime.getType(targetPath),
      })

      var readable = fs.createReadStream(targetPath)
      readable.pipe(res)

      // res.write(data)
      // res.end()
    } else if (stat.isDirectory()) {
      if (urlObj.pathname.at(-1) == '/') {
        var indexPath = path.join(targetPath, 'index.html')

        try {
          // 读取文件状态，如果不存在则会抛出
          var indexStat = await fsp.stat(indexPath)
          if (indexStat.isFile()) {
            //路径存在，并且是文件
            var indexContent = await fsp.readFile(indexPath)
            res.writeHead(200, {
              'Content-Type': 'text/html; charset=UTF-8',
            })
            res.write(indexContent)
            res.end()
          } else {
            // 不是文件，则抛出
            throw 'index is not a file'
          }
        } catch (e) {
          // 文件不存在，列出文件夹的列表
          var entries = await fsp.readdir(targetPath, { withFileTypes: true })
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=UTF-8',
          })

          res.write('<ul>')
          res.write(`<li><a href="../">../</a></li>`)
          for (let entry of entries) {
            let slash = entry.isDirectory() ? '/' : ''
            res.write(
              `<li><a href="${path.posix.join(
                urlObj.pathname,
                entry.name,
              )}${slash}">${entry.name}${slash}</a></li>`,
            )
          }
          res.write('</ul>')
          res.end()
        }
      } else {
        res.writeHead(302, {
          Location: `http://${req.headers.host}${urlObj.pathname}/${urlObj.search}/`,
        })
        res.end()
      }
    } else {
      throw 'not and file or directory'
    }
  } catch (e) {
    console.log(e)
    res.writeHead(404)
    res.write(String(e))
    res.end()
  }
})

server.listen(port, () => {
  // console.log('listening on port', port)
  console.log(server.address())
})

// http跳转协商过程：
/**
 *
 * GET /libs HTTP/1.1
 * =========================
 * HTTP/1.1 302 Moved
 * Location: /libs/
 * =========================
 * GET /libs/ HTTP/1.1
 * =========================
 * HTTP/1.1 200 OK
 *
 * <list of directory html>
 *
 *
 *
 *
 *  GET /../../../../../../../../../Users/xieran/Desktop/工资条.xls HTTP/1.1
 *
 *
 *
 *
 *
 *
 *
 * ERROR_EMPTY_RESPONSE
 * ERROR_CONTENT_LENGTH_MISMATCH
 * ERROR_CONNECTION_RESET
 * ERROR_CONNECTION_REFUSED
 * ERROR_CONNECTION_TIMEOUT
 * ERROR_NETWORK_CHANGE
 *
 *
 *
 * 作业：用fs上的创建可读可写流的函数实现文件的复制
 *
 * node cp.js   src target
 */
