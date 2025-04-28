// src/controllers/AuthController.ts
import { Config } from "@/config";
import { authService } from "@/services/AuthService";
import { LoginSchemaType } from "@/validations/login";
import { RegisterSchemaType } from "@/validations/register";
import { Request, Response, NextFunction } from "express";
import { verifyRefreshToken } from "@/utils/jwt";
import createHttpError from "http-errors";

export class AuthController {
  /**
   * Login a user
   * @param req - The request object
   * @param res - The response object
   * @param next - The next function
   * @returns - The response object
   */
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: LoginSchemaType = req.body;
      const { user, token, refreshToken } = await authService.login(email, password);

      res
        .cookie(Config.REFRESH_TOKEN_NAME, refreshToken, {
          httpOnly: true,
          secure: Config.NODE_ENV === "production",
          maxAge: Config.REFRESH_TOKEN_EXPIRES_IN_MS,
          sameSite: "lax",
        })
        .json({
          code: "LOGIN_SUCCESS",
          message: "Login successful",
          data: { token, data: user },
        });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Register a user
   * @param req - The request object
   * @param res - The response object
   * @param next - The next function
   * @returns - The response object
   */
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name }: RegisterSchemaType = req.body;
      const user = await authService.register(email, password, name);

      res.status(201).json({
        code: "USER_CREATED",
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh a user's token
   * @param req - The request object
   * @param res - The response object
   * @param next - The next function
   * @returns - The response object
   */
  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies[Config.REFRESH_TOKEN_NAME];

      if (!refreshToken) {
        throw createHttpError.Unauthorized("Unauthorized");
      }

      const decoded = verifyRefreshToken(refreshToken);

      if (!decoded) {
        res.clearCookie(Config.REFRESH_TOKEN_NAME);
        throw createHttpError.Unauthorized("Unauthorized");
      }

      const { id } = decoded;
      const tokens = await authService.refreshToken(id);

      res
        .cookie(Config.REFRESH_TOKEN_NAME, tokens.refreshToken, {
          httpOnly: true,
          secure: Config.NODE_ENV === "production",
          maxAge: Config.REFRESH_TOKEN_EXPIRES_IN_MS,
          sameSite: "lax",
        })
        .json({
          code: "TOKEN_REFRESHED",
          message: "Token refreshed successfully",
          data: { token: tokens.token },
        });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get the logged in user
   * @param req - The request object
   * @param res - The response object
   * @returns - The response object
   */
  public loggedInUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // The user is already attached to the request by the authentication middleware
      if (!req.user?.id) {
        throw createHttpError.Unauthorized("Unauthorized");
      }

      const userProfile = await authService.getUserProfile(req.user.id);

      res.json({
        code: "USER_FETCHED",
        message: "User fetched successfully",
        data: userProfile,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout a user
   * @param req - The request object
   * @param res - The response object
   * @returns - The response object
   */
  public logout = async (req: Request, res: Response) => {
    res.clearCookie(Config.REFRESH_TOKEN_NAME);
    res.json({
      code: "LOGOUT_SUCCESS",
      message: "Logout successful",
    });
  };
}