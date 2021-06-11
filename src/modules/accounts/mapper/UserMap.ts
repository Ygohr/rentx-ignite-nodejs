import { classToClass } from "class-transformer";
import { IUserResponseDTO } from "../dtos/IUserResponseDTO";
import { User } from "../entities/User";

class UserMap {
  static toDTO({ id, email, name, driver_license, avatar, avatar_url }: User): IUserResponseDTO {
    const user = classToClass({ id, email, name, driver_license, avatar, avatar_url });
    return user;
  }
}

export { UserMap };
