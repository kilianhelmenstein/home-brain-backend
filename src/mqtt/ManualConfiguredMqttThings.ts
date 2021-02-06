import { AsyncMqttClient } from 'async-mqtt';

import { IKnownThings } from '../domain/IKnownThings';
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

export class ManualConfiguredMqttThings implements IThings {
   private things: IThing[];

   constructor(private knownThings: IKnownThings, private mqttClient: AsyncMqttClient, private configs: IThingConfiguration[]) {
      this.things = [];
   }

   async init() {
      for (const config of this.configs) {
         if (config.type === 'onoff') {
            const knownThing = await this.knownThings.add(config.topic, config.name);
            this.things.push(new MqttOnOffThing(this.mqttClient, config.topic, knownThing.thingId, knownThing.name));
            console.log(`Manual registered MQTT device. Id: ${knownThing.thingId} Name: ${knownThing.name}. Config: ${config}`);
         } else if (config.type === 'hygrometer') {
            const knownThing = await this.knownThings.add(config.topic, config.name);
            this.things.push(new MqttHygrometer(this.mqttClient, config.topic, knownThing.thingId, knownThing.name));
            console.log(`Manual registered MQTT device. Id: ${knownThing.thingId} Name: ${knownThing.name}. Config: ${config}`);
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