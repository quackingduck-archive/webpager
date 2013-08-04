#!/usr/bin/env node

var http = require('http')
  , resumer = require('resumer')
  , combinedStream = require('combined-stream')
  , childProcess = require('child_process')

var server = http.createServer(function(req, res){
  // If the client 'aint listening then we 'aint talkin
  req.on('close', exitNextTick)
  // Send all of the headers
  res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
  // Hook up the response stream
  var s = responseStream()
  s.on('end', exitNextTick)
  s.pipe(res)
})

var exitNextTick = process.nextTick.bind(process, process.exit.bind(process))

var htmlHeader = function(){
  var s = resumer()
  // poke the browser by filling it's pre-render buffer will nulls
  s.queue(bigChunkOfNothing())
 ;[ '<!DOCTYPE html>'
  , '<html>'
  , '<head>'
  , '<!-- webpager was here -->'
  , '<title>webpager</title>'
  , '</head>'
  , '<body>'
  ].forEach(queueLine.bind(s))
  s.end()
  return s
}

var htmlFooter = function(){
  var s = resumer()
 ;[ '</body>'
  , '</html>'
  ].forEach(queueLine.bind(s))
  s.end()
  return s
}

var queueLine = function(str) { this.queue(str+'\n') }

var bigChunkOfNothing = function(size, blank){
  var str = '' ; size = size || 1000 ; blank = blank || '\0'
  while (size--) { str+=blank }
  return str
}

var responseStream = function(){
  var cs = combinedStream.create()
  cs.append(htmlHeader())
  cs.append(process.stdin)
  cs.append(htmlFooter())
  return cs
}

var openBrowser = function() {
  childProcess.exec('open http://localhost:'+port)
}

var port = 6003 // http://www.urbandictionary.com/define.php?term=pager%20code

// Test with: ping google.com | ./index.js test
var runTests = process.argv[2] === 'test'

if (!runTests) server.listen(port, openBrowser)
else {
  var assert = require('assert')

  assert.equal(bigChunkOfNothing(10).length, 10)

  var rs = responseStream()
  rs.pipe(process.stdout)
}
