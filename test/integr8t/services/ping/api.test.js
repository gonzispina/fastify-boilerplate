const tap = require('tap')
const Ajv = require('ajv')

const config = require('../../../../src/config')
const { GET: getSchema } = require('../../../../src/services/ping/schema')

const ajv = new Ajv({ allErrors: true, coerceTypes: true })
const validator = ajv
  .addSchema(getSchema.response[200], 'ping')

tap.test('Ping API', async (childTest) => {
  const fastify = await require('../../../../src/server')(config.fastify)

  fastify.log.level = 'fatal'

  childTest.tearDown(async () => {
    await fastify.close()
  })

  childTest.plan(1)

  childTest.test('GET /ping OK', async (t) => {
    t.plan(3)

    const response = await fastify.inject({
      method: 'GET',
      url: fastify.config.prefix + '/ping'
    })

    t.strictEqual(response.statusCode, 200)
    t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')

    const payload = JSON.parse(response.payload)
    t.ok(validator.validate('ping', payload))

    t.end()
  })

  childTest.end()
})
