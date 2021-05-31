import { ICreateUserTokensDTO } from "@modules/accounts/dtos/ICreateUserTokensDTO";
import { UserTokens } from "@modules/accounts/entities/UserTokens";
import { getRepository, Repository } from "typeorm";
import { IUserTokensRepository } from "../IUserTokensRepository";

class UserTokensRepository implements IUserTokensRepository {
  private repository: Repository<UserTokens>;
  constructor() {
    this.repository = getRepository(UserTokens);
  }

  async create({ user_id, expiration_date, refresh_token }: ICreateUserTokensDTO): Promise<UserTokens> {
    const userToken = this.repository.create({
      user_id,
      expiration_date,
      refresh_token
    });

    await this.repository.save(userToken);

    return userToken;
  }
}

export { UserTokensRepository };
