import { IThing, IThingData, ThingType } from "../domain/IThing";
import { Id } from "../domain/Id";

interface IThermostatInfo {
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

interface IThermostatCommands {
   mode: 'auto' | 'manu' | 'eco' | undefined;
   valve: 'on' | 'off' | undefined;
   boost: boolean | undefined;
   lock: boolean | undefined;
   temperature: number | undefined;
   temperatureOffset: number | undefined;
}

export class BluetoothEq3Thermostat implements IThing {
   private isConnected: boolean;
   properties: IThingData;

   constructor(private eq3: any, id: Id, name: string) {
      this.isConnected = false;
      this.properties = { id, name, type: ThingType.Thermostat };

      this.eq3.on('disconnect', () => this.isConnected = false );
   }

   async handleCommand(command: any): Promise<void> {
      try {
         await this.ensureConnection();
         
         const thermostatCommands = command as IThermostatCommands;
         if (thermostatCommands.mode) {
            if (thermostatCommands.mode === 'auto')
               await this.eq3.automaticMode();
            else if (thermostatCommands.mode === 'manu')
            await this.eq3.manualMode();
            else if (thermostatCommands.mode === 'eco')
            await this.eq3.ecoMode();
         }

         if (thermostatCommands.valve) {
            if (thermostatCommands.valve === 'on')
               await this.eq3.turnOn();
            else if (thermostatCommands.valve === 'off')
            await this.eq3.turnOff();
         }

         if (thermostatCommands.boost)
            await this.eq3.setBoost(thermostatCommands.boost);

         if (thermostatCommands.lock)
            await this.eq3.setLock(thermostatCommands.lock);

         if (thermostatCommands.temperature)
            await this.eq3.setTemperature(thermostatCommands.temperature);

         if (thermostatCommands.temperatureOffset)
            await this.eq3.setTemperatureOffset(thermostatCommands.temperatureOffset);
      } catch (e) {
         throw `Error while executing command. Thing type: Eq3 bluetooth thermostat. Error :${e}`;
      }
   }
   
   async telemetry(): Promise<any> {
      throw new Error('Thermostats do not support telemetry');
   }

   async status(): Promise<IThermostatInfo> {
      try {
         await this.ensureConnection();
         const info = await this.eq3.getInfo();
         return info;
      } catch (e) {
         throw `Error while reading thing status. Thing type: Eq3 bluetooth thermostat. Error: ${e}`;
      }
   }
   
   private async ensureConnection() {
      if (this.isConnected) {
         console.log(`Already connected to ${this.properties.name}`);
         return;
      }
      try {
         await this.eq3.connectAndSetup();
         this.isConnected = true;      
         console.log(`Connected to Eq3 blueetooth thermostat. Thing ${this.properties}`);
      } catch (e) {
         throw `Cannot connect to Eq3 blueetooth thermostat. Thing ${this.properties}`;
      }
   }
}