import { Router } from 'express';

import { IThings}  from '../domain/IThings';
import { ThingsController } from './ThingsController';

const apiRouter = (things: IThings): Router => {
    const router: Router = Router();
    router.use('/things', ThingsController(things));
    return router;    
};

export default apiRouter;
