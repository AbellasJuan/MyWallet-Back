import { Router } from 'express';
import { signOut } from '../controllers/signOutController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const signOutRouter = Router();

signOutRouter.delete('/sign-out', authMiddleware, signOut);

export default signOutRouter;