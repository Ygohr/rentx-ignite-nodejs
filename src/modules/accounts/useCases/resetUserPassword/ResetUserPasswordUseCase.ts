import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import { AppError } from "@shared/errors/appError";
import { IDateUtils } from "@shared/lib/DateUtils/IDateUtils";
import { hash } from "bcrypt";
import dayjs from "dayjs";
import { inject, injectable } from "tsyringe";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetUserPasswordUseCase {
  constructor(
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DateUtils")
    private dateUtils: IDateUtils,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const currentDate = dayjs().toDate();
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError("Token is not valid!");
    }

    const tokenDateValidation = this.dateUtils.dateIsBefore(currentDate, userToken.expiration_date);

    if (!tokenDateValidation) {
      throw new AppError("Token is expired!");
    }

    const user = await this.usersRepository.findById(userToken.user_id);
    const newPassword = await hash(password, 8);

    await this.usersRepository.updatePassword(user.id, newPassword);
    await this.userTokensRepository.deleteById(userToken.id);
  }
}

export { ResetUserPasswordUseCase };
