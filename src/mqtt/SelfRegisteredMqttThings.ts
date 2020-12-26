import { AsyncMqttClient } from 'async-mqtt';

import { IThings } from '../domain/IThings';
import { IThing } from '../domain/IThing';
import { MqttOnOffThing } from './MqttOnOffThing';

const registrationTopic = 'registration';

interface RegistrationInfo {
   clientId: string;
   topic: string;
   type: string;
}

export class SelfRegisteredMqttThings implements IThings {
   private things: IThing[];
   private idCounter: number;

   constructor(private mqttClient: AsyncMqttClient) {
      this.things = [];
      this.idCounter = 0;
      this.listenToRegistrations();
   }

   private listenToRegistrations() {
      this.mqttClient.subscribe(`${registrationTopic}/#`);
      this.mqttClient.on('message', async (topic: string, message: Buffer) => {
         const isNoRegistration = !topic.startsWith(registrationTopic);
         if (isNoRegistration)
            return;

         console.log(`"${topic}" registered with: ${message}`);
         
         const registrationInfo = JSON.parse(message.toString()) as RegistrationInfo;
         if (registrationInfo.type === 'onoff') {
            this.idCounter += 1;
            this.things.push(new MqttOnOffThing(this.mqttClient, registrationInfo.topic, this.idCounter, topic));
         } else {
            console.log('Type not supported');
         }
      });
   }
   
   async all(): Promise<IThing[]> {
      return this.things;
   }

   async one(id: number): Promise<IThing | undefined> {
      return this.things.find(t => t.data.id === id);
   }
}