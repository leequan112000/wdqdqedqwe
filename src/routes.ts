import { Router } from 'express';
import { indexHome, webhookRouter, authRouter } from './controller';

const routes = Router();

routes.get('/', indexHome);
routes.use('/webhook', webhookRouter);
routes.use('/auth', authRouter);

export default routes;
