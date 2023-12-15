import express from "express";
import authController from "../../controllers/auth-controller.js";
import { authenticate, isEmptyBody, uploadMulter, isEmptyVerifyBody } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";
import { userSchemaJoi, subscriptionUpdateJoi, verifyJoi } from "../../models/User.js";

const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, validateBody(userSchemaJoi), authController.register)

authRouter.post('/login', isEmptyBody, validateBody(userSchemaJoi), authController.login)

authRouter.get('/current', authenticate, authController.getCurrent)

authRouter.post('/logout', authenticate, authController.logout)

authRouter.patch('/', authenticate, isEmptyBody, validateBody(subscriptionUpdateJoi), authController.updateSubscription)

authRouter.patch('/avatars', authenticate, uploadMulter.single("avatar"), authController.updateAvatar)

authRouter.get('/verify/:verificationToken', authController.verify)

authRouter.post('/verify', isEmptyVerifyBody, validateBody(verifyJoi), authController.resendVerify)

export default authRouter;