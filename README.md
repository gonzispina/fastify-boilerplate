# fastify-boilerplate

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

Fastify Template

- [Fastify](https://www.fastify.io/)

Future features:
- OAS3
- MongoDB
- Redis

Endpoint for testing:
``` bash
curl http://localhost/api/v1/ping
```

*Note: Compression and CORS headers had been delegated to nginx*

To run with nginx reverse proxy run :
``` bash
docker-compose up --build
```

For testing run.
``` bash
npm t
```

*Note: Fastify has its own way to run integration tests.*
