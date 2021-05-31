import { ICreateUserTokensDTO } from "../dtos/ICreateUserTokensDTO";
import { UserTokens } from "../entities/UserTokens";

interface IUserTokensRepository {
  create({ user_id, expiration_date, refresh_token }: ICreateUserTokensDTO): Promise<UserTokens>;
}

export { IUserTokensRepository };
