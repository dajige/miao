class eventEmitter {
  constructor(){
     this._events={
      // mouseover:[f1,f2,f3],
      // moveenter:[g1,g2,g3]
     }
  }
  on(eventName,handler){
    if(!this._events[eventName]){
      this._events[eventName] = []
    }
    this._events[eventName].push(handler)

  }
  off(eventName,handler){
var handlers = this._events[eventName] ?? []
var pos = handlers.indexOF(handler)
handlers.splice(pos,1)

// handlers = handlers.filter(it =>it !== handler)
// this._events[eventName] = handlers
  }
  once(eventName,handler){
          this.on(eventName,function f(...args){
        handler.call(this,...args)
        this.off(eventName,f)
    })
  }
  emit(eventName,...arg){
    var handlers = this._events[eventName]
    for(var hand of handlers){
      hand.call(this,...arg)
    }
  }
}


const ee = new eventEmitter()
ee.on('click',function(a,b){
  console.log(a+b)
})
ee.on('click',function(a,b){
  console.log(a-b)
})
ee.on('click',function(a,b){
  console.log(a*b)
})

ee.emit('click',8,4)