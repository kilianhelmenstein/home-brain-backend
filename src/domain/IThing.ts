import { Id } from './Id'

export enum ThingType {
   OnOff,
   Hygrometer,
   Thermostat
}

export interface IThingData {
   id: Id;
   name: string;
   type: ThingType;
}

export interface IThing {
   properties: IThingData;
   handleCommand(command: any): Promise<void>;
   status(): Promise<any>;
   telemetry(): Promise<any>;
}