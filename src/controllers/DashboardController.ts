import { Router, Request, Response } from 'express';

import { IDashboards } from '../domain/IDashboards';
import { IThings } from '../domain/IThings';
 
const userId = '1';

export const DashboardController = (dashboards: IDashboards, things: IThings): Router => {
  const router: Router = Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const thingIds = await dashboards.thingIds(userId);
      const dashbaordThings = await Promise.all(thingIds.map(thingId => things.one(thingId)))
      const onlyThingsData = dashbaordThings.filter(t => t !== undefined).map(t => t.properties);
      res.status(200).send(onlyThingsData);
    }
    catch (error) {
      console.log(`Error while reading an user dashboard. UserId: ${userId}. Error: ${error}`);
      res.status(404).send(error);
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    const thingId = req.body.thingId;
    try {
      await dashboards.appendThing(userId, thingId);
      console.log(`Added thing to user dashboard. ThingId: ${thingId}; UserId: ${userId}`);
      res.status(200).send();
    }
    catch (error) {
      console.log(`Error while adding a thing to an user dashboard. UserId: ${userId}. ThingId: ${thingId}. Error: ${error}`);
      res.status(404).send(error);
    }
  });

  router.delete('/:thingId', async (req: Request, res: Response) => {
    const thingId = req.params.id;
    try {
      await dashboards.removeThing(userId, thingId);
      console.log(`Removed thing from user dashboard. ThingId: ${thingId}; UserId: ${userId}`);
      res.status(200).send();
    }
    catch (error) {
      console.log(`Error while removing a thing from an user dashboard. UserId: ${userId}. ThingId: ${thingId}. Error: ${error}`);
      res.status(404).send(error);
    }
  });

  return router;
};
