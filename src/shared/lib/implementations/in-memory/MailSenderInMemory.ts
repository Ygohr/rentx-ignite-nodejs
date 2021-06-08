import { IMailTemplateVariables } from "@modules/accounts/useCases/forgotPasswordMail/ForgotPasswordMailUseCase";
import { IMailSender } from "@shared/lib/IMailSender";

class MailSenderInMemory implements IMailSender {
  private emails = [];
  async sendMail(to: string, subject: string, variables: IMailTemplateVariables, path: string): Promise<void> {
    this.emails.push({
      to,
      subject,
      variables,
      path
    });
  }
}

export { MailSenderInMemory };
