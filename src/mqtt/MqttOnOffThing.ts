import { AsyncMqttClient } from 'async-mqtt';

import { IThing, IThingData, ThingType } from '../domain/IThing';
import AsBuffer from '../utils/AsBuffer';

interface SwitchCommand {
   status: 'on' | 'off';
}

export class MqttOnOffThing implements IThing {
   public data: IThingData;

   constructor(
      private mqttClient: AsyncMqttClient,
      private topic: string,
      id: number,
      name: string) {
      this.data = { id: id, name: name, type: ThingType.OnOff };
   }
   
   async handleCommand(command: any) {
      if (this.isSwitchCommand(command)) {
         await this.mqttClient.publish(this.topic, AsBuffer(command));
      }
   }

   async telemetry(): Promise<any> {
      return;
   }

   private isSwitchCommand(command: any): command is SwitchCommand {
      return (command as SwitchCommand).status !== undefined;
   }
}