import EQ3BLE from '@nullent1ty/eq3ble';

import { IRegisteredThings } from '../domain/IRegisteredThings';
import { IThings } from '../domain/IThings';
import { IThing } from '../domain/IThing';
import { Id } from '../domain/Id';

import { BluetoothEq3Thermostat } from './BluetoothEq3Thermostat';

interface IBluetoothThermostatConfig {
   name: string;
   mac_address: string;
}

export class BluetoothEq3Thermostats implements IThings {
   private thermostats: BluetoothEq3Thermostat[];

   constructor(private registeredThings: IRegisteredThings, private configs: IBluetoothThermostatConfig[]) {
      this.thermostats = [];
   }

   async init(): Promise<void> {
      try {
         console.log(`Trying to discover eq3 bluetooth thermostats...`);
         EQ3BLE.discoverAll(async (bluetoothDevice: any) => {
            console.log(`Discovered eq3 bluetooth thermostat. MAC address: ${bluetoothDevice.address}`);
            const config = this.configs.filter(c => c.mac_address === bluetoothDevice.address)[0];
            const isConfigured = config !== undefined;

            if (isConfigured) {
               console.log(`Discovered eq3 bluetooth thermostat matches to a configured thing. MAC address: ${bluetoothDevice.address}. Matching configuration: '${config.name}'`);
            } else {
               console.log(`Discovered eq3 bluetooth thermostat does not match to any configured things. MAC address: ${bluetoothDevice.address}.`);
            }

            const registeredThing = await this.registeredThings.add(bluetoothDevice.address, isConfigured ? config.name : bluetoothDevice.address)
            const thermostat = new BluetoothEq3Thermostat(bluetoothDevice, registeredThing.thingId, registeredThing.name);
            this.thermostats.push(thermostat);
         });
      } catch (e) {
         throw `Error while discovering eq3 bluetooth thermostats. Error: ${e}`;
      }
   }

   async all(): Promise<IThing[]> {
      return this.thermostats;
   }

   async one(id: Id): Promise<IThing | undefined> {
      return this.thermostats.filter(t => t.properties.id === id)[0];
   }
}