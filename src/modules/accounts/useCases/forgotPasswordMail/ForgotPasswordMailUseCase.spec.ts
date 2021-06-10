import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UserTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserTokensRepositoryInMemory";
import { AppError } from "@shared/errors/appError";
import { DateUtils } from "@shared/lib/DateUtils/DateUtils";
import { MailSenderInMemory } from "@shared/lib/MailSender/in-memory/MailSenderInMemory";
import { ForgotPasswordMailUseCase } from "./ForgotPasswordMailUseCase";

let forgotPasswordMailUseCase: ForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let userTokensRepositoryInMemory: UserTokensRepositoryInMemory;
let dateUtils: DateUtils;
let mailSender: MailSenderInMemory;

describe("Send Forgot Password Mail", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    userTokensRepositoryInMemory = new UserTokensRepositoryInMemory();
    dateUtils = new DateUtils();
    mailSender = new MailSenderInMemory();
    forgotPasswordMailUseCase = new ForgotPasswordMailUseCase(usersRepositoryInMemory, userTokensRepositoryInMemory, dateUtils, mailSender);
  });

  it("1) Should be able to send mail to recover password to user", async () => {
    const spyOnSendMail = spyOn(mailSender, "sendMail");
    await usersRepositoryInMemory.create({
      name: "John Doe",
      email: "john@email.com",
      password: "123",
      driver_license: "ABCD1234"
    });

    await forgotPasswordMailUseCase.execute("john@email.com");

    expect(spyOnSendMail).toHaveBeenCalled();
  });

  it("2) Should not be able to send an email to inexistent user", async () => {
    try {
      await forgotPasswordMailUseCase.execute("inexistent_user@email.com");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("User does not exists!");
    }
  });

  it("3) Should be able to create a new userToken", async () => {
    const spyOnUserTokensRepository = spyOn(userTokensRepositoryInMemory, "create");

    await usersRepositoryInMemory.create({
      name: "Mary Jane",
      email: "mary@email.com",
      password: "321",
      driver_license: "ABCD4321"
    });

    await forgotPasswordMailUseCase.execute("mary@email.com");

    expect(spyOnUserTokensRepository).toHaveBeenCalled();
  });
});
