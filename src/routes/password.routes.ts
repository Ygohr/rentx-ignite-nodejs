import { ForgotPasswordMailController } from "@modules/accounts/useCases/forgotPasswordMail/ForgotPasswordMailController";
import { ResetUserPasswordController } from "@modules/accounts/useCases/resetUserPassword/ResetUserPasswordController";
import { Router } from "express";

const passwordRoutes = Router();

const forgotPasswordMailController = new ForgotPasswordMailController();
const resetUserPasswordController = new ResetUserPasswordController();

passwordRoutes.post("/forgot", forgotPasswordMailController.handle);
passwordRoutes.post("/reset", resetUserPasswordController.handle);

export { passwordRoutes };
