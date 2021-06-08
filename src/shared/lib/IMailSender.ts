import { IMailTemplateVariables } from "@modules/accounts/useCases/forgotPasswordMail/ForgotPasswordMailUseCase";

interface IMailSender {
  sendMail(to: string, subject: string, variables: IMailTemplateVariables, path: string): Promise<void>;
}

export { IMailSender };
