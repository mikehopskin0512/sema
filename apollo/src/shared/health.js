import mongoose from 'mongoose';
import { Pool } from 'pg';

import logger from './logger';
import errors from './errors';

const pool = new Pool({ connectionString: process.env.POSTGRES_CONNECTION, connectionTimeoutMillis: 1000 });

export default (app) => {
  app.use('/health', async (req, res) => {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
    };

    try {
      // Check Mongo DB connection
      if (mongoose.connection.readyState === 0) {
        const err = new errors.InternalServer('Not connected to MongoDB');
        logger.error(err);
        throw (err);
      }

      // Check Postgres DB connection
      const client = await pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      res.status(200).send(healthcheck);
    } catch (e) {
      healthcheck.message = e;
      res.status(503).send();
    }
  });
};
