/*
 * Destination's API Get
 */

module.exports = (fastify) => {
  return async (request, reply) => {
    reply.type('application/json')
    reply.send({ message: 'pong' })
  }
}
