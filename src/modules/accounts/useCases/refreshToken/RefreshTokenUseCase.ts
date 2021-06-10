import { authItems } from "@config/auth";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import { AppError } from "@shared/errors/appError";
import { IDateUtils } from "@shared/lib/DateUtils/IDateUtils";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DateUtils")
    private dateUtils: IDateUtils
  ) {}

  async execute(token: string): Promise<ITokenResponse> {
    const { secretRefreshToken, refreshTokenExpiresIn, refreshTokenExpirationDays, secretToken, tokenExpiresIn } = authItems;
    const { email, sub } = verify(token, secretRefreshToken) as IPayload;
    const user_id = sub;

    const userToken = await this.userTokensRepository.findUserByRefreshToken(user_id, token);

    if (!userToken) {
      throw new AppError("Refresh token does not exists!");
    }

    await this.userTokensRepository.deleteById(userToken.id);

    const refresh_token = sign({ email }, secretRefreshToken, {
      subject: user_id,
      expiresIn: refreshTokenExpiresIn
    });

    const expiration_date = this.dateUtils.dateAdd(refreshTokenExpirationDays, "days");

    await this.userTokensRepository.create({
      expiration_date,
      refresh_token,
      user_id
    });

    const newToken = sign({}, secretToken, {
      subject: user_id,
      expiresIn: tokenExpiresIn
    });

    return {
      token: newToken,
      refresh_token
    };
  }
}

export { RefreshTokenUseCase };
