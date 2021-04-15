import { AppError } from "@errors/appError";
import { UsersRepository } from "@modules/accounts/implementations/UsersRepository";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token is missing!", 401);
  }

  const [, token] = authHeader.split(" ");
  try {
    const { sub: user_id } = verify(token, "44f7e546e7154e04d7e9f13574be041c") as IPayload;

    const usersRepository = new UsersRepository();
    const user = await usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User does not exists!", 401);
    }

    request.user = {
      id: user_id
    };

    next();
  } catch (error) {
    throw new AppError("Invalid token!", 401);
  }
}
