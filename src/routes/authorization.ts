import authorizationController from 'controller/authorization';
import { Router } from 'express';

const router = Router();

router
  .route('/login')
  .post((request, response) =>
    authorizationController.login(request, response),
  );

router
  .route('/register')
  .post((request, response) =>
    authorizationController.register(request, response),
  );

router
  .route('/logout')
  .get((request, response) =>
    authorizationController.logout(request, response),
  );

router
  .route('/authorize')
  .get((request, response) =>
    authorizationController.authorize(request, response),
  );

export default router;
