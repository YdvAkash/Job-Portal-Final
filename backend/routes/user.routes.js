import { Router } from "express";
const userRouter = Router();
import {
  validateRequest,
  signInSchema,
  signupSchema,
  updateProfileSchema,
} from "../middlewares/validation.js";
import {
  login,
  logout,
  register,
  updateProfile,
  toggleSaveJob,
  verifyEmail,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/auth.js";
import {  uploadMiddleware } from "../middlewares/multer.js";
// Correctly pass the function references
userRouter.post(
  "/register",
  uploadMiddleware,
  validateRequest(signupSchema),
  register
);
  userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.put(
  "/profile",
  uploadMiddleware,
  validateRequest(updateProfileSchema),
  isAuthenticated,
  updateProfile
);

userRouter.post(
  "/profile/save/:id",
  isAuthenticated,
  toggleSaveJob
);

userRouter.get("/verify-email/:token", verifyEmail);

export default userRouter;
