import { Router, raw } from 'express';
import { stripeWebhook, indexHome } from './controller';
import { pandadocWebhook } from './controller/webhooks/pandadoc';

const routes = Router();

routes.get('/', indexHome);
routes.post('/webhook/stripe', raw({ type: 'application/json' }), stripeWebhook);
routes.post('/webhook/pandadoc', raw({ type: 'application/json' }), pandadocWebhook);

export default routes;