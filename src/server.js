/**
 * Server implementation
 */

const fastify = require('fastify')({ logger: true })
const registerServices = require('./services')

module.exports = async (config) => {
  fastify.decorate('config', config)

  fastify.register(require('under-pressure'), {
    maxEventLoopDelay: 1000,
    retryAfter: 50
  })

  registerServices(fastify, config)

  fastify.setErrorHandler((err, request, reply) => {
    reply.type('application/json')

    if (reply.res.statusCode !== 500) {
      reply.send({ message: err.message })
      return
    }

    reply.status(500)
    reply.send({ message: 'Internal Error occured. Try again later' })

    fastify.log.error(err.message)
  })

  try {
    await fastify.listen(config.port, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }

  return fastify
}
