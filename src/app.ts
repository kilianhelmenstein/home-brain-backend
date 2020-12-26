import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

import mqtt from 'async-mqtt';

import apiRouter from './controllers'; 
import errorHandler from './controllers/ErrorHandler';

import { CollectedThings } from './domain/CollectedThings';
import { SelfRegisteredMqttThings } from './mqtt/SelfRegisteredMqttThings';
import { ManualRegisteredMqttThings } from './mqtt/ManualRegisteredMqttThings';
import { BluetoothEq3Thermostats } from './bluetooth/BluetoothEq3Thermostats';

import * as mqttThings from './mqtt-things.json';
import * as bluetoothThings from './bluetooth-things.json';

dotenv.config({
   path: '.env'
});

const port = process.env.APP_PORT || 5000;
const mqttServer = process.env.MQTT_SERVER || '';

async function run() {
   console.log(`Try connecting to ${mqttServer}...`);
   const mqttClient = await mqtt.connectAsync(mqttServer, { protocolId: 'MQIsdp', protocolVersion: 3, connectTimeout:1000 });
   console.log(`Connected to ${mqttServer}`);

   const bluetoothThermostats = new BluetoothEq3Thermostats(bluetoothThings.things, 10);
   await bluetoothThermostats.init();

   const things = new CollectedThings([
      new SelfRegisteredMqttThings(mqttClient),
      new ManualRegisteredMqttThings(mqttClient, mqttThings.things, 4),
      bluetoothThermostats
   ]);

   const app = express();
   app.use(bodyParser.json())
   app.use(morgan('tiny'));
   app.use(cors());
   app.use('/api', apiRouter(things));
   app.use(errorHandler);
   app.listen(port, () => console.log(`> Listening on port ${port}`));
}

run();
