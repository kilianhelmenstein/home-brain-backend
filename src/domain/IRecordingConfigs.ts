import { Seconds } from './Time'
import { Id } from './Id'

export class RecordingConfig {
   constructor(
      public id: Id,
      public thingId: Id,
      public dataNames: string[],
      public intervall: Seconds,
      public lifetime: Seconds) {}
}

export interface IRecordingConfigs {
   all(): Promise<RecordingConfig[]>;
   forThing(thingId: Id): Promise<RecordingConfig>;
   addOrUpdate(config: RecordingConfig) : Promise<RecordingConfig>;
   remove(id: Id): Promise<void>;
}