import { Seconds } from './Time'
import { Id } from './Id'

export class RecordingConfig {
   thingId: Id;
   dataNames: string[];
   intervall: Seconds;
   lifetime: Seconds;
}

export interface IRecordingConfigs {
   all(): Promise<RecordingConfig[]>;
   forThing(thingId: Id): Promise<RecordingConfig>;
   addOrUpdate(config: RecordingConfig) : Promise<RecordingConfig>;
   remove(thingId: Id): Promise<void>;
}