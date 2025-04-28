import express from "express";
import { Controllers } from "@/controllers";
import { authenticate } from "@/middleware/authentication";

const UserRouter = express.Router();
const { UserController } = Controllers;

UserRouter.get("/", authenticate, UserController.findUser);

export { UserRouter };
