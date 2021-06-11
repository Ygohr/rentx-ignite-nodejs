import { Router } from "express";
import multer from "multer";
import uploadConfig from "@config/upload";
import { CreateUserController } from "@modules/accounts/useCases/createUser/CreateUserController";
import { ensureAuthenticated } from "@shared/middlewares/ensureAuthenticated";
import { UpdateUserAvatarController } from "@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController";
import { UserProfileController } from "@modules/accounts/useCases/userProfile/UserProfileController";

const uploadAvatar = multer(uploadConfig);
const usersRoutes = Router();
const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();
const userProfileController = new UserProfileController();

usersRoutes.post("/", createUserController.handle);
usersRoutes.patch("/avatar", ensureAuthenticated, uploadAvatar.single("avatar"), updateUserAvatarController.handle);
usersRoutes.get("/profile", ensureAuthenticated, userProfileController.handle);

export { usersRoutes };
