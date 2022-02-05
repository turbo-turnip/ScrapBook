import env from './config/env.config'
import { LogType, log, flush, logsPath } from './util/log.util';
import express, { Application, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app: Application = express();
const prisma = new PrismaClient();

(async () => {

  async function main(port: number) {
    app.listen(port, () => log(LogType.INIT, `Server started on port ${port}`));
  }

  try {
    await main(8080);
  } catch(err: any) {
    log(LogType.ERROR, err);
  }
})();

process.on('exit', () => {
  log(LogType.TERMINATE, 'Server terminated');
  prisma.$disconnect();
});