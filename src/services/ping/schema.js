/*

QUERY STRING EXAMPLE
(There is a lack in the documentation)

querystring: {
  type: 'object',
  properties: {
    location: { type: 'string' }
  },
  required: ['location']
},
*/

const GET = {
  summary: 'PING API',
  description: 'Returns "PONG"',

  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
}

module.exports = {
  GET
}
