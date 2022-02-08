import { Router } from 'express';
import { loadRegisters, newEntry , newExit} from '../controllers/registerController.js';
import { validRegisterMiddleware } from '../middlewares/validRegisterMIddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const registerRouter = Router();

registerRouter.use(authMiddleware)

registerRouter.get('/userRegisters', loadRegisters);

registerRouter.post('/new-entry',validRegisterMiddleware, newEntry);

registerRouter.post('/new-exit',validRegisterMiddleware, newExit);

export default registerRouter;