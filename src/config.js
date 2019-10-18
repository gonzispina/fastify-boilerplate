/**
 * Process configuration
 */

module.exports = {
  fastify: {
    prefix: '/api/v1',
    port: process.env.PORT || 8080,
    pino: {
      level: 'info'
    }
  }
}
