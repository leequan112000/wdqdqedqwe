import { Router } from 'express';
import {
  indexHome,
  webhookRouter,
  authRouter,
  sitemapRouter,
} from './controller';

const routes = Router();

routes.get('/', indexHome);
routes.use('/webhook', webhookRouter);
routes.use('/auth', authRouter);
routes.use('/sitemap', sitemapRouter);

export default routes;
