import { Id } from './Id'

export interface IDashboards {
   thingIds(userId: Id): Promise<Id[]>;
   appendThing(userId: Id, thingId: Id): Promise<void>;
   removeThing(userId: Id, thingId: Id): Promise<void>;
}