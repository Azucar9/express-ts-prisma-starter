import { UserController as UserControllerClass } from "./UserController";
import { AuthController as AuthControllerClass } from "./AuthController";

export const Controllers = {
  UserController: new UserControllerClass(),
  AuthController: new AuthControllerClass(),
};
