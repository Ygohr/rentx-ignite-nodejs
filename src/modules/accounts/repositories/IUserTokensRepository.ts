import { ICreateUserTokensDTO } from "../dtos/ICreateUserTokensDTO";
import { UserTokens } from "../entities/UserTokens";

interface IUserTokensRepository {
  create({ user_id, expiration_date, refresh_token }: ICreateUserTokensDTO): Promise<UserTokens>;
  findRefreshToken(user_id: string, refresh_token: string): Promise<UserTokens>;
  deleteById(id: string): Promise<void>;
}

export { IUserTokensRepository };
