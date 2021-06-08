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

  async findUserByRefreshToken(user_id: string, refresh_token: string): Promise<UserTokens> {
    const userToken = await this.repository.findOne({ user_id, refresh_token });
    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByToken(refresh_token: string): Promise<UserTokens> {
    const userToken = await this.repository.findOne({ refresh_token });
    return userToken;
  }
}

export { UserTokensRepository };
