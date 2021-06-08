import { Request, Response } from "express";
import { container } from "tsyringe";
import { ForgotPasswordMailUseCase } from "./ForgotPasswordMailUseCase";

class ForgotPasswordMailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;
    const resetPasswordMailUseCase = container.resolve(ForgotPasswordMailUseCase);

    await resetPasswordMailUseCase.execute(email);
    return response.json();
  }
}

export { ForgotPasswordMailController };
