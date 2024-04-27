"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("helpers/logger"));
const nodemailer_1 = __importDefault(require("nodemailer"));
class MailService {
    constructor() { }
    static getInstance() {
        if (!MailService.instance) {
            MailService.instance = new MailService();
        }
        return MailService.instance;
    }
    async createLocalConnection() {
        let account = await nodemailer_1.default.createTestAccount();
        this.transporter = nodemailer_1.default.createTransport({
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
        const smtpOptions = {
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: process.env.SMTP_TLS === "yes" ? true : false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        };
        this.transporter = nodemailer_1.default.createTransport(smtpOptions);
    }
    async sendMail(options, requestId, cb) {
        try {
            const res = await this.transporter.sendMail({
                from: options.from || process.env.SMTP_SENDER,
                to: options.to,
                cc: options.cc,
                bcc: options.bcc,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });
            logger_1.default.info(`${requestId} - [MailResponse]=${res.response} [MessageId=${res.messageId}]`);
            if (cb)
                cb(null, res);
            else
                return res;
        }
        catch (err) {
            logger_1.default.error(`${requestId} - Failed to send mail.`);
            logger_1.default.error(err);
            if (cb)
                cb(err);
            else
                throw err;
        }
    }
    async verifyConnection() {
        return this.transporter.verify();
    }
    get getTransporter() {
        return this.transporter;
    }
}
exports.default = MailService;
//# sourceMappingURL=mail.js.map