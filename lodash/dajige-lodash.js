var dajige = {
  chunk: function (array, size) {
    var rns = [], temp = [],n = array.length
    for (var i = 0; i < n; i++){
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
}
