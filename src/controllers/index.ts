import { Router } from 'express';

import { IThings}  from '../domain/IThings';
import { IDashboards}  from '../domain/IDashboards';
import { IRecordingConfigs }  from '../domain/IRecordingConfigs';
import { IAutomationConfigs }  from '../domain/IAutomationConfigs';
import { IThingGroups }  from '../domain/IThingGroups';

import { ThingsController } from './ThingsController';
import { DashboardController } from './DashboardController';
import { RecordingConfigsController } from './RecordingConfigsController';
import { AutomationConfigsController } from './AutomationConfigsController';
import { ThingGroupsController } from './ThingGroupsController';

const apiRouter = (
    things: IThings,
    dashboards: IDashboards,
    thingGroups: IThingGroups,
    recordingConfigs: IRecordingConfigs,
    automationConfigs: IAutomationConfigs): Router => {
    const router: Router = Router();
    router.use('/things', ThingsController(things));
    router.use('/dashboard', DashboardController(dashboards, things));
    router.use('/groups', ThingGroupsController(thingGroups));
    router.use('/recordings', RecordingConfigsController(recordingConfigs));
    router.use('/automations', AutomationConfigsController(automationConfigs));
    return router;
};

export default apiRouter;
