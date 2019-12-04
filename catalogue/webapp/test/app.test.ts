const request = require('supertest');
const app = require('../app');

test('healthcheck', async () => {
  const server = await app;
  const resp = await request(server.callback()).get(
    '/works/management/healthcheck'
  );

  expect(resp.status).toEqual(200);
});
