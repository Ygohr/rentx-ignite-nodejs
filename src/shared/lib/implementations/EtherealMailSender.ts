import { injectable } from "tsyringe";
import nodemailer, { Transporter } from "nodemailer";
import fs from "fs";
import handleBars from "handlebars";
import { IMailTemplateVariables } from "@modules/accounts/useCases/forgotPasswordMail/ForgotPasswordMailUseCase";
import { IMailSender } from "../IMailSender";

@injectable()
class EtherealMailSender implements IMailSender {
  private client: Transporter;
  constructor() {
    nodemailer
      .createTestAccount()
      .then((account) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass
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
      from: "Rentx <noreply@rentx.com.br>",
      subject,
      html: templateHTML
    });

    console.log("Message sent: %s", message.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}

export { EtherealMailSender };
