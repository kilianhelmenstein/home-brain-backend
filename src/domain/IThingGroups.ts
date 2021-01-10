import { Id } from './Id'

export class ThingGroup {
   constructor(public id: Id, public name: string, public thingIds: Id[]) {}
}

export interface IThingGroups {
   all(): Promise<ThingGroup[]>;
   add(name: string, thingIds: Id[]): Promise<ThingGroup>;
   update(group: ThingGroup): Promise<ThingGroup>;
   remove(id: Id): Promise<void>;
}