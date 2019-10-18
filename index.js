/**
 * API service enty point
 */

const config = require('./src/config')

async function start () {
  try {
    // Only use var here so the variables are available in all the closure context
    var fastify = await require('./src/server')(config.fastify)

    process.once('SIGINT', gracefulShutDown)
    process.once('SIGTERM', gracefulShutDown)

    return fastify
  } catch (err) {
    console.log(err)
    process.exit(1)
  }

  async function gracefulShutDown (code) {
    await fastify.close()

    console.log('')
    console.log('Terminating process')
    process.exit(code || 0)
  }
}

start()
