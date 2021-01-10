import { AsyncMqttClient } from 'async-mqtt';

import { IRegisteredThings } from '../domain/IRegisteredThings';
import { IThings } from '../domain/IThings';
import { IThing } from '../domain/IThing';
import { Id } from '../domain/Id';

import { MqttOnOffThing } from './MqttOnOffThing';
import { MqttHygrometer } from './MqttHygrometer';

interface IThingConfiguration {
   name: string;
   topic: string;
   type: string;
}

export class ManualRegisteredMqttThings implements IThings {
   private things: IThing[];

   constructor(private registeredThings: IRegisteredThings, private mqttClient: AsyncMqttClient, private configs: IThingConfiguration[]) {
      this.things = [];
   }

   async init() {
      for (const config of this.configs) {
         if (config.type === 'onoff') {
            const registeredThing = await this.registeredThings.add(config.topic, config.name);
            this.things.push(new MqttOnOffThing(this.mqttClient, config.topic, registeredThing.thingId, registeredThing.name));
            console.log(`Manual registered MQTT device. Id: ${registeredThing.thingId} Name: ${registeredThing.name}. Config: ${config}`);
         } else if (config.type === 'hygrometer') {
            const registeredThing = await this.registeredThings.add(config.topic, config.name);
            this.things.push(new MqttHygrometer(this.mqttClient, config.topic, registeredThing.thingId, registeredThing.name));
            console.log(`Manual registered MQTT device. Id: ${registeredThing.thingId} Name: ${registeredThing.name}. Config: ${config}`);
         } else {
            console.log(`Type ${config.type} of thing ${config.name} not supported`);
         }
      }
   }
   
   async all(): Promise<IThing[]> {
      return this.things;
   }

   async one(id: Id): Promise<IThing | undefined> {
      return this.things.find(t => t.properties.id === id);
   }
}