import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import { AppError } from "@shared/errors/appError";
import { IDateUtils } from "@shared/lib/IDateUtils";
import { IMailSender } from "@shared/lib/IMailSender";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";
import { resolve } from "path";

export interface IMailTemplateVariables {
  name: string;
  link: string;
}

@injectable()
class ForgotPasswordMailUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UserTokensRepository")
    private userTokens: IUserTokensRepository,
    @inject("DateUtils")
    private dateUtils: IDateUtils,
    @inject("MailSender")
    private mailSender: IMailSender
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    const templatePath = resolve(__dirname, "..", "..", "views", "emails", "forgotPassword.hbs");

    if (!user) {
      throw new AppError("User does not exists!");
    }

    const token = uuidV4();

    await this.userTokens.create({
      refresh_token: token,
      user_id: user.id,
      expiration_date: this.dateUtils.dateAdd(3, "hours")
    });

    const mailTemplateVariables: IMailTemplateVariables = {
      name: user.name,
      link: `${process.env.FORGOT_PASSWORD_MAIL_URL}${token}`
    };

    await this.mailSender.sendMail(email, "Recuperação de Senha", mailTemplateVariables, templatePath);
  }
}

export { ForgotPasswordMailUseCase };
