import { IThing, IThingData, ThingType } from "../domain/IThing";

export interface IThermostatInfo {
   status: {
      manual: boolean;
      holiday: boolean;
      boost: boolean;
      dst: boolean;
      openWindow: boolean;
      lowBattery: boolean;
   };
   valvePosition: number;
   targetTemperature: number;
}

export class BluetoothEq3Thermostat implements IThing {
   data: IThingData;

   constructor(private eq3: any, id: number, name: string) {
      this.data = { id, name, type: ThingType.Thermostat };
   }

   handleCommand(command: any): Promise<void> {
      throw new Error('Method not implemented.');
   }

   async telemetry(): Promise<IThermostatInfo> {
      return await this.eq3.getInfo();
   }
}