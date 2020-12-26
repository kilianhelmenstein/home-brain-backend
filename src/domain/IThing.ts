export enum ThingType {
   OnOff,
   Hygrometer,
   Thermostat
}

export interface IThingData {
   id: number;
   name: string;
   type: ThingType;
}

export interface IThing {
   data: IThingData;
   handleCommand(command: any): Promise<void>;
   telemetry(): Promise<any>;
}