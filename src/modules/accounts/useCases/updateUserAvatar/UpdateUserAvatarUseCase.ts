import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IStorage } from "@shared/lib/Storage/IStorage";
import { inject, injectable } from "tsyringe";

interface IRequest {
  user_id: string;
  avatar_file: string;
}

export enum FoldersName {
  Avatar = "avatar",
  Cars = "cars"
}

@injectable()
class UpdateUserAvatarUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("Storage")
    private storage: IStorage
  ) {}

  async execute({ user_id, avatar_file }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (user.avatar) {
      await this.storage.delete(user.avatar, FoldersName.Avatar);
    }

    await this.storage.save(avatar_file, FoldersName.Avatar);

    user.avatar = avatar_file;
    await this.usersRepository.create(user);
  }
}

export { UpdateUserAvatarUseCase };
