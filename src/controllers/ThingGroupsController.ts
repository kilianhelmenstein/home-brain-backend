
import { Router, Request, Response } from 'express';

import { IThingGroups, ThingGroup } from '../domain/IThingGroups';
import { Id } from '../domain/Id';
 
export const ThingGroupsController = (thingGroups: IThingGroups): Router => {
  const router: Router = Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const allGroups = await thingGroups.all();
      res.status(200).send(allGroups);
    }
    catch (error) {
      console.log(`Error while reading all thing groups. Error: ${error}`);
      res.status(404).send(error);
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    const newGroup = req.body as { name: string, thingIds: Id[]};
    try {
      const addedGroup = await thingGroups.add(newGroup.name, newGroup.thingIds);
      console.log(`Added a new thing group. New group: ${addedGroup}`);
      res.status(200).send();
    }
    catch (error) {
      console.log(`Error while adding a new thing group. New ThingGroup: ${newGroup}. Error: ${error}`);
      res.status(404).send(error);
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const group = req.body as { name: string, thingIds: Id[]};
    try {
      const udpatedGroup = await thingGroups.update(new ThingGroup(id, group.name, group.thingIds));
      console.log(`Update a thing group. Updated group: ${udpatedGroup}`);
      res.status(200).send();
    }
    catch (error) {
      console.log(`Error while updating a thing group. New ThingGroup: ${group}. Error: ${error}`);
      res.status(404).send(error);
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await thingGroups.remove(id);
      console.log(`Removed a thing group. GroupId: ${id}`);
      res.status(200).send();
    }
    catch (error) {
      console.log(error);
      res.status(404).send(error);
    }
  });

  return router;
};
