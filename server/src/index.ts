import { LogType, log, flush, logsPath } from './util/log.util';
import express, { Application, Request, Response, json } from 'express';
import { UserRouter } from './routes';
import cors from "cors";

const app: Application = express();

(async () => {
  async function main(port: number) {
    app.use(json({ limit: '5kb' }));
    app.use(cors({ origin: "http://localhost:3000" }));
    app.use('/user', UserRouter);
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
});