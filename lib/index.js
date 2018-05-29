import crypto from 'crypto'

import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

let app = new Koa()

app.use(bodyParser())
app.use(async (ctx, next) => {
  // Catch an errors that we either threw or that weren't supposed to happen
  try {
    // After the routing is complete
    await next()

    // If no routes were hit, 404
    ctx.status = ctx.status || 404

    // If an error was thrown earlier, pass it on
    if (ctx.status >= 400) ctx.throw(ctx.status)
  } catch (err) {
    // Make sure our response reflects our error
    ctx.status = err.status || 500 // Make sure we have a status code

    // Make sure we have a usable body
    if (ctx.body == null || ctx.body !== Object(ctx.body)) ctx.body = {}

    // Tell Koa that we've handled an error
    ctx.app.emit('err', err, ctx)
  }

  // Add a timestamp
  ctx.body.received = Date.now()

  // Provide an integrity hash to verify the response against
  let hash = crypto.createHash('sha1')
  hash.update(JSON.stringify(ctx.body))
  ctx.set('x-integrity', hash.digest('hex'))
})

let router = new Router()

// Provide a status endpoint
router.get('/ping', ctx => {
  ctx.body = {
    ping: 'pong'
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

let server = app.listen(3000, '0.0.0.0', () => {
  console.log('Listening on port 3000')
})

export { server }
