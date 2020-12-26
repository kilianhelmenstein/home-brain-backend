import { AsyncMqttClient } from 'async-mqtt';

import { IThings } from '../domain/IThings';
import { IThing } from '../domain/IThing';
import { MqttOnOffThing } from './MqttOnOffThing';
import { MqttHygrometer } from './MqttHygrometer';

interface IThingConfiguration {
   name: string;
   topic: string;
   type: string;
}

export class ManualRegisteredMqttThings implements IThings {
   private things: IThing[];

   constructor(mqttClient: AsyncMqttClient, configs: IThingConfiguration[], idOffset: number) {
      this.things = [];
      let idCounter = idOffset;
      
      for (const config of configs) {
         if (config.type === 'onoff') {
            idCounter += 1;
            this.things.push(new MqttOnOffThing(mqttClient, config.topic, idCounter, config.name));
         } else if (config.type === 'hygrometer') {
            idCounter += 1;
            this.things.push(new MqttHygrometer(mqttClient, config.topic, idCounter, config.name));
         } else {
            console.log('Type not supported');
         }
      }
   }
   
   async all(): Promise<IThing[]> {
      return this.things;
   }

   async one(id: number): Promise<IThing | undefined> {
      return this.things.find(t => t.data.id === id);
   }
}