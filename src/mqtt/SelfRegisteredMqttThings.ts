import { AsyncMqttClient } from 'async-mqtt';

import { IThings } from '../domain/IThings';
import { IKnownThings } from '../domain/IKnownThings';
import { IThing } from '../domain/IThing';
import { Id } from '../domain/Id';

import { MqttOnOffThing } from './MqttOnOffThing';

const registrationTopic = 'registration';

interface RegistrationInfo {
   clientId: string;
   name: string;
   topic: string;
   type: string;
}

export class SelfRegisteredMqttThings implements IThings {
   private things: IThing[];

   constructor(private knownThings: IKnownThings, private mqttClient: AsyncMqttClient) {
      this.things = [];
   }

   async init() {
      this.mqttClient.subscribe(`${registrationTopic}/#`);
      this.mqttClient.on('message', async (topic: string, message: Buffer) => {
         const isNoRegistration = !topic.startsWith(registrationTopic);
         if (isNoRegistration)
            return;
         
      const registrationInfo = JSON.parse(message.toString()) as RegistrationInfo;
      if (registrationInfo.type === 'onoff') {
         const knownThing = await this.knownThings.add(registrationInfo.topic, registrationInfo.name);
         const thing = new MqttOnOffThing(this.mqttClient, registrationInfo.topic, knownThing.thingId, knownThing.name);
         this.things.push(thing);
         console.log(`Self-Registered MQTT device. Type: OnOff. Id: ${knownThing.thingId}. Name: ${knownThing.name}. Registration message: ${message}`);
      } else {
            console.log(`Self-Registering of MQTT device failed. Reason: Type not supported. Registration message: ${message}`);
         }
      });
   }
   
   async all(): Promise<IThing[]> {
      return this.things;
   }

   async one(id: Id): Promise<IThing | undefined> {
      return this.things.find(t => t.properties.id === id);
   }
}