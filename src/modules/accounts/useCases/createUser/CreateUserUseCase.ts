import { inject, injectable } from "tsyringe";
import { hash } from "bcrypt";
import { AppError } from "@errors/appError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ name, password, email, driver_license }: ICreateUserDTO): Promise<void> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw new AppError("User already exists!", 400);
    }
    const passwordHash = await hash(password, 8);
    await this.usersRepository.create({ name, password: passwordHash, email, driver_license });
  }
}

export { CreateUserUseCase };
