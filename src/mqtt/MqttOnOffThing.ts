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

   async status(): Promise<any> {
      throw new Error('On/Off things do not support status');
   }

   async telemetry(): Promise<any> {
      throw new Error('On/Off things do not support telemetry');
   }

   private isSwitchCommand(command: any): command is SwitchCommand {
      return (command as SwitchCommand).status !== undefined;
   }
}
