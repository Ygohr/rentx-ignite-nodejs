import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UserTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserTokensRepositoryInMemory";
import { AppError } from "@shared/errors/appError";
import { IDateUtils } from "@shared/lib/IDateUtils";
import { DateUtils } from "@shared/lib/implementations/DateUtils";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let userTokensRepositoryInMemory: UserTokensRepositoryInMemory;
let dateUtils: IDateUtils;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    userTokensRepositoryInMemory = new UserTokensRepositoryInMemory();
    dateUtils = new DateUtils();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory, userTokensRepositoryInMemory, dateUtils);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("1) Should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "user@test.com",
      password: "1234",
      driver_license: "789456"
    };

    await createUserUseCase.execute(user);
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(result).toHaveProperty("token");
  });

  it("2) Should not be able to authenticate when user does not exists", async () => {
    try {
      const result = await authenticateUserUseCase.execute({
        email: "inexistentuser@email.com",
        password: "123"
      });

      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Email or password incorrect!");
      expect(error.statusCode).toBe(404);
    }
  });

  it("3) Should not be able to authenticate when user password does not match", async () => {
    try {
      const user: ICreateUserDTO = {
        name: "User test",
        email: "user@test.com",
        password: "1234",
        driver_license: "789456"
      };

      await createUserUseCase.execute(user);
      const result = await authenticateUserUseCase.execute({
        email: user.email,
        password: "wrongPassword"
      });

      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Email or password incorrect!");
      expect(error.statusCode).toBe(404);
    }
  });
});
