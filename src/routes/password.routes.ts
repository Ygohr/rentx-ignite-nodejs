import { ForgotPasswordMailController } from "@modules/accounts/useCases/resetPasswordMail/ForgotPasswordMailController";
import { Router } from "express";

const passwordRoutes = Router();

const resetPasswordMailController = new ForgotPasswordMailController();

passwordRoutes.post("/forgot", resetPasswordMailController.handle);

export { passwordRoutes };
