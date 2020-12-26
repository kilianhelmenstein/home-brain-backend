import { IThings } from '../domain/IThings';
import { IThing, IThingData, ThingType } from '../domain/IThing';

const EQ3BLE = require('eq3ble');

interface IBluetoothThermostatConfig {
   name: string;
   mac_address: string;
}

class BluetoothEq3Thermostat implements IThing {
   data: IThingData;

   constructor(private device: any, id: number, name: string) {
      this.data = { id, name, type: ThingType.Thermostat };
   }

   handleCommand(command: any): Promise<void> {
      throw new Error('Method not implemented.');
   }

   telemetry(): Promise<any> {
      throw new Error('Method not implemented.');
   }
}

export class BluetoothEq3Thermostats implements IThings {
   private thermostats: BluetoothEq3Thermostat[];

   constructor(private configs: IBluetoothThermostatConfig[], private idOffset: number) {
      this.thermostats = [];
   }

   async init(): Promise<void> {
      let idCount = this.idOffset;

      for (const config of this.configs) {
         try {
            EQ3BLE.discoverById(config.mac_address, async (bluetoothDevice: any) => {
               await bluetoothDevice.connectAndSetup();
               idCount += 1;
               const thermostat = new BluetoothEq3Thermostat(bluetoothDevice, idCount, config.name);
               this.thermostats.push(thermostat);
            });
         } catch (e) {
            console.log(`Error while discovering bluetooth thermostat ${config.mac_address} (Name: ${config.name}): `, e);
         }
      }
   }

   async all(): Promise<IThing[]> {
      return this.thermostats;
   }

   async one(id: number): Promise<IThing | undefined> {
      return this.thermostats.filter(t => t.data.id === id)[0];
   }
}