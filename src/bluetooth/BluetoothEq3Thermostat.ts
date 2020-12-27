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
   private isConnected: boolean;
   data: IThingData;

   constructor(private eq3: any, id: number, name: string) {
      this.isConnected = false;
      this.data = { id, name, type: ThingType.Thermostat };

      this.eq3.on('disconnect', () => this.isConnected = false );
   }

   handleCommand(command: any): Promise<void> {
      throw new Error('Method not implemented.');
   }

   async telemetry(): Promise<IThermostatInfo> {
      try {
         await this.ensureConnection();
         const info = await this.eq3.getInfo();
         return info;
      } catch (e) {
         console.log(`Error while getInfo() from ${this.data.name}: `, e);
      }
   }
   
   private async ensureConnection() {
      if (this.isConnected) {
         console.log(`Already connected to ${this.data.name}`);
         return;
      }
      await this.eq3.connectAndSetup();
      console.log(`Connected to ${this.data.name}`);
      this.isConnected = true;      
   }
}