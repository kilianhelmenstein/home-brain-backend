import { Router, Request, Response } from 'express';

import { IThings } from '../domain/IThings';
 
export const ThingsController = (things: IThings): Router => {
  const router: Router = Router();

  router.get('/', async (req: Request, res: Response) => {
    try {
      const allThings = await things.all();
      const onlyData = allThings.map(t => t.data);
      res.status(200).send(onlyData);
    }
    catch (error) {
      console.log(error);
      res.status(404).send(error);
    }
  });

  router.post('/:id/commands', async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const thing = await things.one(id);
      
      const isUnknownThing = thing === undefined;
      if (isUnknownThing)
        return res.status(404).send();

      await thing!.handleCommand(req.body);
      res.status(200).send();
    }
    catch (error) {
      console.log(error);
      res.status(404).send(error);
    }
  });

  router.get('/:id/status', async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const thing = await things.one(id);
      
      const isUnknownThing = thing === undefined;
      if (isUnknownThing)
        return res.status(404).send();

      const status = await thing!.status();
      res.status(200).send(status);
    }
    catch (error) {
      console.log(error);
      res.status(404).send(error);
    }
  });

  router.get('/:id/telemetry', async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const thing = await things.one(id);
      
      const isUnknownThing = thing === undefined;
      if (isUnknownThing)
        return res.status(404).send();

      const telemetry = await thing!.telemetry();
      res.status(200).send(telemetry);
    }
    catch (error) {
      console.log(error);
      res.status(404).send(error);
    }
  });

  return router;
};
