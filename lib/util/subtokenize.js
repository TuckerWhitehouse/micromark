module.exports = subtokenize

var codes = require('../character/codes')
var flatMap = require('./flat-map')

function subtokenize(events) {
  var length = events.length
  var index = -1
  var result = []
  var start = 0
  var token

  while (++index < length) {
    token = events[index][1]

    if (token.contentType && !token._contentTokenized) {
      token._contentTokenized = true
      result = result.concat(
        events.slice(start, index + 1),
        flatMap(
          events[index][2].sliceStream(token).concat(codes.eof),
          events[index][2].parser[token.contentType](token.start)
        )
      )
      start = index + 1
    }
  }

  result = result.concat(events.slice(start))

  return {done: !start, events: result}
}