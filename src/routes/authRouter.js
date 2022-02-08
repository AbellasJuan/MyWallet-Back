import { Router } from 'express';
import { signUp, signIn} from '../controllers/authController.js';
import { validUserMiddleware } from '../middlewares/validUserMiddleware.js';
import { validSignInMiddleware } from '../middlewares/validSignInMiddleware.js';

const authRouter = Router();

authRouter.post('/auth/sign-in', validSignInMiddleware, signIn);

authRouter.post('/auth/sign-up', validUserMiddleware , signUp);

export default authRouter;