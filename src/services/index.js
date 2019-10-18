/**
 * Services register for fastify
 */

const ping = require('./ping')

module.exports = (fastify, opts) => {
  fastify.register(ping, opts)
}
