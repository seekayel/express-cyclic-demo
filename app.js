const child_process = require('child_process');
const express = require('express')
const app = express()

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['index.html'],
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

app.use(express.static('public', options))

app.get('/hello.json', (req,res) => {
  res.json({
    Hello: ['Hola!', 'Hello', 'Привет', '你好', 'こんにちは'],
    World: ['🌎', '🌍','🌏','🗺','🌐'],
    at: new Date().toISOString(),
    msg: "Hello my friend."
  })
})

app.get('/_', async (req,res) => {
  const npm_version = child_process.spawnSync('npm',['--version'])
  const module_version = child_process.spawnSync('npm',['version'])

  res.json({
    npm: npm_version.stdout.toString(),
    module: module_version.stdout.toString(),
  })
})

app.use('*', (req,res) => {
  console.log('[hello-world] Star handler called')
  res
    .set('x-powered-by', 'cyclic.sh')
    .set('content-type', 'application/json')
    .send(JSON.stringify({
      msg: "Thanks for playing Kevin!",
      at: new Date().toISOString(),
      method: req.method,
      hostname: req.hostname,
      ip: req.ip,
      path: req.params[0],
      query: req.query,
      headers: req.headers,
      // cookies: req.cookies,
      env: process.env
    },null,2))
    .end()
})

module.exports = app
