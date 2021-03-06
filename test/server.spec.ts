import assert from 'assert';
import got from 'got';
import {WebServer} from '../src/WebServer';

const port = +(process.env.GESTION_STOCK_TEST_PORT || '3222');
const dbUri =
  process.env.GESTION_STOCK_DBURI ||
  'mongodb://localhost:27017/test-gestion-client';
const domain = `http://localhost:${port}`;

describe('Server start and stop', function () {
  it('should start and stop the server ', async function () {
    this.timeout(30000);

    const server = new WebServer({port, dbUri});
    await server.start();
    const response = await got
      .get(domain + '/api/counter')
      .json<{counter: number}>();
    assert(typeof response.counter === 'number');
    await server.stop();
    try {
      await got.get(domain + '/api/counter');
      assert(false);
    } catch (err) {
      assert(err.code === 'ECONNREFUSED');
    }
    try {
      await server.stop();
      assert(false);
    } catch (err) {
      assert(err.code === 'ERR_SERVER_NOT_RUNNING');
    }
  });
  it('should stop the server in error', async function () {
    this.timeout(3000);

    const server = new WebServer({port, dbUri});
    try {
      await server.stop();
      assert(false);
    } catch (err) {
      assert(err instanceof Error && err.message.startsWith('Cannot stop'));
    }
  });

  it('should start the server in error (same port) ', async function () {
    this.timeout(30000);

    const server = new WebServer({port, dbUri});
    await server.start();
    const response = await got
      .get(domain + '/api/counter')
      .json<{counter: number}>();
    assert(typeof response.counter === 'number');

    try {
      await server.start();
      assert(false);
    } catch (err) {
      assert(err.code === 'EADDRINUSE');
    } finally {
      await server.stop();
    }
  });
});
