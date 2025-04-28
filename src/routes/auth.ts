import { Controllers } from "@/controllers";
import express from "express";
import { validate } from "@/middleware/validate";
import { LoginSchema } from "@/validations/login";
import { authenticate } from "@/middleware/authentication";
import { RegisterSchema } from "@/validations/register";

const AuthRouter = express.Router();
const { AuthController } = Controllers;

AuthRouter.post("/login", validate(LoginSchema), AuthController.login);
AuthRouter.post("/register", validate(RegisterSchema), AuthController.register);
AuthRouter.post("/token/refresh", AuthController.refreshToken);

// Protected routes
AuthRouter.get("/me", authenticate, AuthController.loggedInUser);
AuthRouter.post("/logout", authenticate, AuthController.logout);

export { AuthRouter };
