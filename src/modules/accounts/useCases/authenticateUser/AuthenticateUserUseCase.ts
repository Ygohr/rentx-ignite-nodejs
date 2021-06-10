import { inject, injectable } from "tsyringe";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { AppError } from "@shared/errors/appError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import { authItems } from "@config/auth";
import { IDateUtils } from "@shared/lib/DateUtils/IDateUtils";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DateUtils")
    private dateUtils: IDateUtils
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    const { secretRefreshToken, tokenExpiresIn, secretToken, refreshTokenExpiresIn, refreshTokenExpirationDays } = authItems;

    if (!user) {
      throw new AppError("Email or password incorrect!", 404);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Email or password incorrect!", 404);
    }

    const token = sign({}, secretToken, {
      subject: user.id,
      expiresIn: tokenExpiresIn
    });

    const refresh_token = sign({ email }, secretRefreshToken, {
      subject: user.id,
      expiresIn: refreshTokenExpiresIn
    });

    const refreshTokenExpirationDate = this.dateUtils.dateAdd(refreshTokenExpirationDays, "days");

    await this.userTokensRepository.create({
      user_id: user.id,
      expiration_date: refreshTokenExpirationDate,
      refresh_token
    });

    return {
      user: {
        name: user.name,
        email: user.email
      },
      token,
      refresh_token
    };
  }
}

export { AuthenticateUserUseCase };
