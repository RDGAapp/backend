import authorizationController from 'controller/authorization';
import { Router } from 'express';

const router = Router();

router.route('/login').post(authorizationController.login);

router.route('/register').post(authorizationController.register);

router.route('/logout').get(authorizationController.logout);

router.route('/authorize').get(authorizationController.authorize);

export default router;
