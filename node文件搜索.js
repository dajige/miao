const fs = require('fs')
const fsp = fs.promises
const path = require('path')

//同步版本
function getFileListSync(dir) {
  var result = []
  var entries = fs.readFileSync(dir, { withFileTypes: true })
  for (var entry of entries) {
    if (entry.isFile()) {
      result.push(path.join(dir, entry.name))
    } else if (entry.isDirectory()) {
      result.push(...getFileListSync(path.join(dir, entry.name)))
    }
  }
  return result
}
//异步版本
async function getFileList(dir) {
  var result = []
  var entries = await fsp.readFile(dir, { withFileTypes: true })
  for (var entry of entries) {
    var entryname = path.join(dir, entry.name)
    if (entry.isFile()) {
      result.push(entryname)
    } else if (entry.isDirectory()) {
      var resultOFchild = await getFileList(entryname)
      result.push(...resultOFchild)
    }
  }
  return result
}

//回调版本
function getfileListcallback(dir, callback) {
  var result = []
  var i = 0
  fs.readFile(dir, { withFileTypes: true }, (err, entries) => {
    for (var entry of entries) {
      if (entry.isFile()) {
        result.push(path.join(dir, entry.name))
      } else if (entry.isDirectory()) {
        i++
        getfileListcallback(path.join(dir, entry.name), (list) => {
          result.push(...list)
          i--
          if ((i = 0)) {
            callback(result)
          }
        })
      }
    }
  })
  callback(result)
}
// promise版本
function getfilelistp(dir) {
  return fsp.readFile(dir, { withFileTypes: true }).then((entries) => {
    return promise
      .all(
        entries.map((entry) => {
          if (entry.isFile()) {
            return path.join(dir, entry.name)
          } else if (entry.isDirectory()) {
            return getfilelistp(path.join(dir, entry.name))
          }
        }),
      )
      .then((result) => {
        return result.flat()
      })
  })
}
