import logger from "helpers/logger";
import nodemailer, { SentMessageInfo } from "nodemailer";
import { MailOptions, SMTPConfig } from "types";

export default class MailService {
  private static instance: MailService;
  private transporter!: nodemailer.Transporter;

  private constructor() {}

  static getInstance() {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }
    return MailService.instance;
  }

  async createLocalConnection() {
    let account = await nodemailer.createTestAccount();
    this.transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  }

  async createConnection() {
    const smtpOptions: SMTPConfig = {
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT!),
      secure: process.env.SMTP_TLS === "yes" ? true : false,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASSWORD!,
      },
    };
    this.transporter = nodemailer.createTransport(smtpOptions);
  }

  async sendMail(
    options: MailOptions,
    requestId: string | undefined | null,
    cb?: (err: Error | null, info?: SentMessageInfo) => void
  ) {
    try {
      const res: SentMessageInfo = await this.transporter.sendMail({
        from: options.from || process.env.SMTP_SENDER!,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      logger.info(`${requestId} - [MailResponse]=${res.response} [MessageId=${res.messageId}]`);
      if (cb) cb(null, res);
      else return res;
    } catch (err: any) {
      logger.error(`${requestId} - Failed to send mail.`);
      logger.error(err);
      if (cb) cb(err);
      else throw err;
    }
  }

  async verifyConnection() {
    return this.transporter.verify();
  }

  get getTransporter() {
    return this.transporter;
  }
}
