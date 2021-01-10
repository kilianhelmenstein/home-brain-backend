import { Seconds, Day, TimeOfDay } from './Time'
import { Id } from './Id'

export type IntervallOfExecution = Seconds;

export type TimeOfExecution = {
   days: Day[];
   time: TimeOfDay;
}

export class AutomationConfig {
   constructor(
      public id: Id, 
      public execution: IntervallOfExecution | TimeOfExecution,
      public thingId: Id,
      public command: string,
      public commandParameter: string) {}
}

export interface IAutomationConfigs {
   all(): Promise<AutomationConfig[]>;
   forThing(thingId: Id): Promise<AutomationConfig[]>;
   add(config: AutomationConfig) : Promise<AutomationConfig | undefined>;
   update(config: AutomationConfig) : Promise<AutomationConfig | undefined>;
   remove(id: Id): Promise<void>;
}