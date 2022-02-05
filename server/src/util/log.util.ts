import { readFile, readFileSync, writeFileSync } from 'fs';
import env from '../config/env.config';

// Logging types
export enum LogType {
  ERROR = "[ERROR]",
  SUCCESS = "[SUCCESS]",
  ADDED = "[ADDED]",
  INIT = "[INIT]",
  HTTP_ERROR = "[HTTP_ERROR]",
  TERMINATE = "[TERMINATED]"
}

// Absolute path to logs (Relative: ../logs/log.txt)
export const logsPath = `${process.cwd()}/src/logs/log.txt`;
export const flushLogsPath = `${process.cwd()}/src/logs/flush.txt`;

// Flush all logs and add flush timestamp
export const flush = () => {
  let currentFlushLogs = readFileSync(flushLogsPath).toString();
  currentFlushLogs += `Logs flushed at ${new Date().toLocaleString()}\n`;
  writeFileSync(flushLogsPath, currentFlushLogs);

  writeFileSync(logsPath, "");
}

// Logs ../logs/log.txt
// Format: [TYPE] Message [HOUR:MIN:SEC:MS-MONTH:DAY:YEAR]
export const log = (type: LogType, message: string) => {
  const d = new Date();
  const date = `[${d.getHours() > 12 ? 'PM' : 'AM'} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}-${d.getMonth() + 1}/${d.getDay() - 1}/${d.getFullYear()}]\n`;
  let currentLogs = readFileSync(logsPath).toString();
  currentLogs += `${type} ${message} ${date}`;

  writeFileSync(logsPath, currentLogs);

  // Console.log if in development mode
  if (env.ENV === "DEV") 
    console.log(`${type} ${message}`);
}