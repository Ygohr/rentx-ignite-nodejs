import { injectable } from "tsyringe";
import nodemailer, { Transporter } from "nodemailer";
import fs from "fs";
import handleBars from "handlebars";
import { IMailTemplateVariables } from "@modules/accounts/useCases/forgotPasswordMail/ForgotPasswordMailUseCase";
import { IMailSender } from "./IMailSender";

@injectable()
class MailSender implements IMailSender {
  private client: Transporter;
  constructor() {
    nodemailer
      .createTestAccount()
      .then(() => {
        const transporter = nodemailer.createTransport({
          service: process.env.MAIL_SERVICE,
          auth: {
            user: process.env.USER_GMAIL,
            pass: process.env.PSSWD_GMAIL
          }
        });

        this.client = transporter;
      })
      .catch((error) => console.log(error));
  }
  async sendMail(to: string, subject: string, variables: IMailTemplateVariables, path: string): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString("utf-8");
    const templateParse = handleBars.compile(templateFileContent);
    const templateHTML = templateParse(variables);

    const message = await this.client.sendMail({
      to,
      from: `Rentx <${process.env.USER_GMAIL}>`,
      subject,
      html: templateHTML
    });

    console.log("Message sent: %s", message.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}

export { MailSender };
