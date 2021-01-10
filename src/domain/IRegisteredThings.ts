import { Id } from './Id'

export class RegisteredThing {
   constructor(public thingId: Id, public name: string) {}
}

export interface IRegisteredThings {
   add(key: string, defaultName: string): Promise<RegisteredThing>;
}