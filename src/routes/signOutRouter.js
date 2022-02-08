import { Router } from 'express';
import { signOut } from '../controllers/signOutController.js';

const signOutRouter = Router();

signOutRouter.delete('/sign-out', signOut);

export default signOutRouter;