import { IThings } from '../domain/IThings';
import { IThing, IThingData, ThingType } from '../domain/IThing';

import EQ3BLE from '@nullent1ty/eq3ble';

interface IBluetoothThermostatConfig {
   name: string;
   mac_address: string;
}

export class BluetoothEq3Thermostats implements IThings {
   private thermostats: BluetoothEq3Thermostat[];

   constructor(private configs: IBluetoothThermostatConfig[], private idOffset: number) {
      this.thermostats = [];
   }

   async init(): Promise<void> {
      let idCount = this.idOffset;

      try {
         console.log(`Trying to discover bluetooth devices...`);
         EQ3BLE.discoverAll(async (bluetoothDevice: any) => {
            console.log(`Discovered ${bluetoothDevice.address}...`);
            const config = this.configs.filter(c => c.mac_address === bluetoothDevice.address)[0];
            const isConfigured = config !== undefined;

            if (isConfigured) {
               console.log(`Discovered device matches to configured thing '${config.name}'`);
            } else {
               console.log(`Discovered device is not explicitly configured`);
            }

            try {
               console.log(`Trying to connect and setup...`);
               await bluetoothDevice.connectAndSetup();
               console.log(`Connected and setup BLE ${isConfigured ? config.name : bluetoothDevice.address}`);
               
               idCount += 1;
               const thermostat = new BluetoothEq3Thermostat(bluetoothDevice, idCount, isConfigured ? config.name : bluetoothDevice.address);
               this.thermostats.push(thermostat);
            } catch (e) {
               console.log(`Error while connecting to ${isConfigured ? config.name : bluetoothDevice.address}`, e);
            }
         });
      } catch (e) {
         console.log(`Error while discovering bluetooth devices: `, e);
      }
   }

   async all(): Promise<IThing[]> {
      return this.thermostats;
   }

   async one(id: number): Promise<IThing | undefined> {
      return this.thermostats.filter(t => t.data.id === id)[0];
   }
}