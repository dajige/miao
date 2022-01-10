var dajige = {
  chunk: function (array, size) {
    var rns = [],
      temp = [],
      n = array.length
    for (var i = 0; i < n; i++) {
      temp.push(array[i])
      if (temp.length == size) {
        rns.push(temp)
        temp = []
      }
    }
    if (temp.length != 0) {
      rns.push(temp)
    }
    return rns
  },
  compact: function (array) {
    var rns = []
    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        rns.push(array[i])
      }
    }
    return rns
  },
  drop: function (array, number = 1) {
    if (number == 0) {
      return array
    }
    if (array.length < number) {
      return []
    }
    let n = array.length
    let rns = []
    for (let i = number; i < n; i++) {
      rns.push(array[i])
    }
    return rns
  },
}
