import Router from 'koa-router';
import {index, article, wpArticle, explore, healthcheck, favicon} from '../controllers';

const r = new Router();

r.get('/', index);
r.get('/healthcheck', healthcheck);
r.get('/favicon.ico', favicon);
r.get('/explore', explore);
r.get('/articles/wp/:id', wpArticle);
r.get('/:id*', article);

export const router = r.middleware();
