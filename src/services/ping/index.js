/**
 * Destination API resgister
 */

const schema = require('./schema')
const get = require('./get')

module.exports = (fastify, opts, next) => {
  fastify.get('/ping', { schema: schema.GET }, get(fastify))
  next()
}
