import { createTransport } from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';
import env from '../config/env.config';

interface Email {
  subject: string;
  to: string;
  html?: string;
  attachments?: Array<Attachment>;
}

const transporter = createTransport({
  service: 'Gmail',
  auth: {
    user: env.MAILER_ADDR,
    pass: env.MAILER_PASS
  }
});

export const email = (emailOptions: Email) => {
  return new Promise(async (res, rej) => {
    const fullOptions = {
      ...emailOptions,
      from: env.MAILER_ADDR
    };

    transporter.sendMail(fullOptions, (err, info) => {
      if (err) rej(err);
      else res(info.response);
    });
  });
}