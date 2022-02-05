import { config } from 'dotenv';

const envPath = `${process.cwd()}/.env`;

const vars = config({ path: envPath });
if (vars.error)
  throw vars.error;

export default vars.parsed as { [key: string]: string };