// src/controllers/UserController.ts
import { Request, Response, NextFunction } from "express";
import { userService } from "@/services/UserService";

export class UserController {
  /**
   * Find all users
   * @param req Request
   * @param res Response
   * @param next NextFunction
   * @returns - The response object
   */
  public findUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.getAllUsers();

      res.json({
        code: "USERS_FETCHED",
        message: "Users Fetched",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Find user by ID
   * @param req Request
   * @param res Response
   * @param next NextFunction
   * @returns - The response object
   */
  public findUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await userService.getUserById(userId);

      res.json({
        code: "USER_FETCHED",
        message: "User Fetched",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user
   * @param req Request
   * @param res Response
   * @param next NextFunction
   * @returns - The response object
   */
  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id);
      const updateData = req.body;

      const updatedUser = await userService.updateUser(userId, updateData);

      res.json({
        code: "USER_UPDATED",
        message: "User Updated",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete user
   * @param req Request
   * @param res Response
   * @param next NextFunction
   * @returns - The response object
   */
  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id);
      const deletedUser = await userService.deleteUser(userId);

      res.json({
        code: "USER_DELETED",
        message: "User Deleted",
        data: deletedUser,
      });
    } catch (error) {
      next(error);
    }
  };
}