import { Router, raw } from 'express';
import { stripeWebhook, indexHome } from './controller';

const routes = Router();

routes.get('/', indexHome);
routes.post('/webhook/stripe', raw({ type: 'application/json' }), stripeWebhook);

export default routes;