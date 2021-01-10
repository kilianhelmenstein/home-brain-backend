
import { Router, Request, Response } from 'express';

import { IAutomationConfigs, AutomationConfig } from '../domain/IAutomationConfigs';
 
export const AutomationConfigsController = (automationConfigs: IAutomationConfigs): Router => {
  const router: Router = Router();

  router.get('/', async (req: Request, res: Response) => {
    try {
      const allConfigs = await automationConfigs.all();
      res.status(200).send(allConfigs);
    }
    catch (error) {
      console.log(error);
      res.status(404).send(error);
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    const newAutomationConfig = req.body as AutomationConfig;
    try {
      const addedAutomationConfig = await automationConfigs.add(newAutomationConfig);
      console.log(`Added a new automation configuration. New AutomationConfig: ${addedAutomationConfig}`);
      res.status(200).send();
    }
    catch (error) {
      console.log(`Error while added a new automation configuration. AutomationConfig: ${newAutomationConfig}. Error: ${error}`);
      res.status(404).send(error);
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const automationConfig = req.body as AutomationConfig;
    try {
      const isInvalidId = automationConfig.id !== id;
      if (isInvalidId)
        res.status(405).send();

      const updatedAutomationConfig = await automationConfigs.update(automationConfig);
      console.log(`Updated an automation configuration. Updated AutomationConfig: ${updatedAutomationConfig}`);
      res.status(200).send();
    }
    catch (error) {
      console.log(`Error while updating a new automation configuration. AutomationConfig: ${automationConfig}. Error: ${error}`);
      res.status(404).send(error);
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      await automationConfigs.remove(id);
      console.log(`Removed an automation configuration. AutomationConfigId: ${id}`);
      res.status(200).send();
    }
    catch (error) {
      console.log(`Error while removing a new automation configuration. AutomationConfigId: ${id}. Error: ${error}`);
      res.status(404).send(error);
    }
  });

  return router;
};
