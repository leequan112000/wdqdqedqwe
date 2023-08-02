import { Router } from 'express';
import { indexHome, webhookRouter } from './controller';

const routes = Router();

routes.get('/', indexHome);
routes.use('/webhook', webhookRouter);

export default routes;
