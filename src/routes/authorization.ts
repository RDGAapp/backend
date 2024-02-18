import authorizationController from 'controller/authorization';
import { Router } from 'express';

const router = Router();

router.route('/login').post(authorizationController.login);

export default router;
