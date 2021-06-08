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

  async findUserByRefreshToken(user_id: string, refresh_token: string): Promise<UserTokens> {
    const userToken = this.userTokens.find((userToken) => userToken.user_id === user_id && userToken.refresh_token === refresh_token);
    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    const userTokenIndex = this.userTokens.findIndex((userToken) => userToken.id === id);
    this.userTokens.splice(userTokenIndex, 1);
  }

  async findByToken(refresh_token: string): Promise<UserTokens> {
    const userToken = this.userTokens.find((userToken) => userToken.id === refresh_token);
    return userToken;
  }
}

export { UserTokensRepositoryInMemory };
