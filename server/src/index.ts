import env from './config/env.config'
import { LogType, log, flush, logsPath } from './util/log.util';
import express, { Application, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

(async () => {
  const app: Application = express();
  const prisma = new PrismaClient();

  async function main(port: number) {
    app.listen(port, () => log(LogType.INIT, `Server started on port ${port}`));
  }

  try {
    await main(8080);
  } catch(err) {
    console.log('error :|');
  }
})();