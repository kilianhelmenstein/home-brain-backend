import { Router, Request, Response } from 'express';

import { IRecordingConfigs, RecordingConfig } from '../domain/IRecordingConfigs';
 
export const RecordingConfigsController = (recordingConfigs: IRecordingConfigs): Router => {
  const router: Router = Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const allConfigs = await recordingConfigs.all();
      res.status(200).send(allConfigs);
    }
    catch (error) {
      console.log(`Error while reading all recording configurations. Error: ${error}`);
      res.status(404).send(error);
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    const newRecordingConfig = req.body as RecordingConfig;
    try {
      const addRecordingConfig = await recordingConfigs.addOrUpdate(newRecordingConfig);
      console.log(`Added a new recording configuration. New RecordingConfiguration: ${addRecordingConfig}`);
      res.status(200).send();
    }
    catch (error) {
      console.log(`Error while adding a new recording configuration. New RecordingConfig: ${newRecordingConfig}. Error: ${error}`);
      res.status(404).send(error);
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
      const recordingConfig = req.body as RecordingConfig;
      try {
      const updatedRecordingConfig = await recordingConfigs.addOrUpdate(recordingConfig);
      console.log(`Update a recording configuration. Updated RecordingConfiguration: ${updatedRecordingConfig}`);
      res.status(200).send();
    }
    catch (error) {
      console.log(`Error while updating a recording configuration. RecordingConfig: ${recordingConfig}. Error: ${error}`);
      res.status(404).send(error);
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      await recordingConfigs.remove(id);
      console.log(`Removed a recording configuration. Updated RecordingConfigurationId: ${id}`);
      res.status(200).send();
    }
    catch (error) {
      console.log(`Error while removing a recording configuration. RecordingConfigId: ${id}. Error: ${error}`);
      console.log(error);
      res.status(404).send(error);
    }
  });

  return router;
};
