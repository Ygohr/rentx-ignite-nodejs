import { IMailTemplateVariables } from "@modules/accounts/useCases/resetPasswordMail/ForgotPasswordMailUseCase";

interface IMailSender {
  sendMail(to: string, subject: string, variables: IMailTemplateVariables, path: string): Promise<void>;
}

export { IMailSender };
