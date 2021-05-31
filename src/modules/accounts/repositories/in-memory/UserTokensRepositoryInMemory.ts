import { ICreateUserTokensDTO } from "@modules/accounts/dtos/ICreateUserTokensDTO";
import { UserTokens } from "@modules/accounts/entities/UserTokens";
import { IUserTokensRepository } from "../IUserTokensRepository";

class UserTokensRepositoryInMemory implements IUserTokensRepository {
  userTokens: UserTokens[] = [];
  async create({ user_id, expiration_date, refresh_token }: ICreateUserTokensDTO): Promise<UserTokens> {
    const userToken = new UserTokens();
    Object.assign(userToken, {
      user_id,
      expiration_date,
      refresh_token
    });

    this.userTokens.push(userToken);
    return userToken;
  }
}

export { UserTokensRepositoryInMemory };
