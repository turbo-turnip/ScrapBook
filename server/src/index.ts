import env from './config/env.config'
import { LogType, log, flush } from './util/log.util';
import express from 'express';

const main = async (port: number) => {
  const app = express();

  // Limit incoming requests to 5 kilobytes
  app.use(express.json({ limit: '5kb' }));

  app.listen(port, () => {
    // Start server and log start info
    log(LogType.INIT, `Server listening on port ${port}`);
  });
}

main(8080);