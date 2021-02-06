import { Id } from './Id'

export class KnownThing {
   constructor(public thingId: Id, public name: string) {}
}

export interface IKnownThings {
   add(key: string, defaultName: string): Promise<KnownThing>;
}