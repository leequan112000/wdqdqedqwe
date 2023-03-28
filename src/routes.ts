import { Router, raw } from 'express';
import multer from 'multer';
import { stripeWebhook, indexHome } from './controller';
import { pandadocWebhook } from './controller/webhooks/pandadoc';
import { zohoWebhook } from './controller/webhooks/zoho';

const routes = Router();
const upload = multer();

routes.get('/', indexHome);
routes.post('/webhook/stripe', raw({ type: 'application/json' }), stripeWebhook);
routes.post('/webhook/pandadoc', raw({ type: 'application/json' }), pandadocWebhook);
routes.post('/webhook/zoho', upload.single('content'), zohoWebhook);

export default routes;