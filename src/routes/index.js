import {Router} from 'express';
import authRouter from './authRouter.js';
import registerRouter from './registersRouter.js';
import signOutRouter from './signOutRouter.js';

const router = Router();

router.use(authRouter);
router.use(registerRouter);
router.use(signOutRouter);

export default router;