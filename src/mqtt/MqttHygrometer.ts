import { AsyncMqttClient } from 'async-mqtt';

import { IThing, IThingData, ThingType } from '../domain/IThing';
import { Id } from '../domain/Id';

interface IHygrometerTelemetry {
   temperature: number;
   humidity: number;
}

export class MqttHygrometer implements IThing {
   private telemetries: IHygrometerTelemetry[];
   public properties: IThingData;

   constructor(
      private mqttClient: AsyncMqttClient,
      private topic: string,
      id: Id,
      name: string) {
      this.telemetries = [];
      this.properties = { id: id, name: name, type: ThingType.Hygrometer };
   }

   async init() {
      this.mqttClient.subscribe(this.topic);
      this.mqttClient.on('message', async (topic: string, message: Buffer) => {
         const isOtherTopic = topic !== this.topic;
         if (isOtherTopic)
            return;

         const telemetry = JSON.parse(message.toString()) as IHygrometerTelemetry;
         this.addTelemetry(telemetry);
      });
   }
   
   async handleCommand(command: any) {
      throw new Error('Hygrometers do not support commands');
   }

   async status(): Promise<any> {
      throw new Error('Hygrometers do not support status');
   }

   async telemetry(): Promise<any> {
      return { 
         temperature: 19.8,
         humidity: 52.3
      };

      const lastTelemetry = this.telemetries[this.telemetries.length - 1];
      return { 
         temperature: lastTelemetry.temperature,
         humidity: lastTelemetry.humidity
      };
   }

   private addTelemetry(telemetry: IHygrometerTelemetry) {
      this.telemetries.push(telemetry);
   }
}
