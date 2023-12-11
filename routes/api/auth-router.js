import express from "express";
import authController from "../../controllers/auth-controller.js";
import { authenticate, isEmptyBody } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";
import { userSchemaJoi, userSubscriptionUpdateJoi } from "../../models/User.js";

const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, validateBody(userSchemaJoi), authController.register)

authRouter.post('/login', isEmptyBody, validateBody(userSchemaJoi), authController.login)

authRouter.get('/current', authenticate, authController.getCurrent)

authRouter.post('/logout', authenticate, authController.logout)

authRouter.patch('/', authenticate, isEmptyBody, validateBody(userSubscriptionUpdateJoi), authController.updateSubscription)

export default authRouter;