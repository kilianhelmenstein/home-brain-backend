import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

import mqtt from 'async-mqtt';

import apiRouter from './controllers'; 

import { IThings } from './domain/IThings';
import { CollectedThings } from './domain/CollectedThings';

import { SelfRegisteredMqttThings } from './mqtt/SelfRegisteredMqttThings';
import { ManualRegisteredMqttThings } from './mqtt/ManualRegisteredMqttThings';
import { BluetoothEq3Thermostats } from './bluetooth/BluetoothEq3Thermostats';

import { MongoRegisteredThings } from './dataAccess/MongoRegisteredThings';
import { MongoDashboards } from './dataAccess/MongoDashboards';
import { MongoThingGroups } from './dataAccess/MongoThingGroups';
import { MongoRecordingConfigs } from './dataAccess/MongoRecordingConfigs';
import { MongoAutomationConfigs } from './dataAccess/MongoAutomationConfigs';

import * as mqttThings from '../config/mqtt-things.json';
import * as bluetoothThings from '../config/bluetooth-things.json';

dotenv.config({
   path: '.env'
});

const port = process.env.APP_PORT || 5000;
const mqttServer = process.env.MQTT_SERVER || '';
const mongoUrl = process.env.MONGODB_URL || '';
const mongoDatabase = process.env.MONGODB_DATABASE || '';

async function run() {
   console.log(`Try connecting to MQTT-Server: ${mqttServer}...`);
   const mqttClient = await mqtt.connectAsync(mqttServer, { protocolId: 'MQIsdp', protocolVersion: 3, connectTimeout:1000 });
   console.log(`Connected to MQTT-Server: ${mqttServer}`);

   const registeredThings = new MongoRegisteredThings(mongoUrl, mongoDatabase);
   const dashboards = new MongoDashboards(mongoUrl, mongoDatabase);
   const thingGroups = new MongoThingGroups(mongoUrl, mongoDatabase);
   const recordingConfigs = new MongoRecordingConfigs(mongoUrl, mongoDatabase);
   const automationConfigs = new MongoAutomationConfigs(mongoUrl, mongoDatabase);

   const thingSources: IThings[] = [];
   try {
      const selfRegisteredMqttThings = new SelfRegisteredMqttThings(registeredThings, mqttClient);
      await selfRegisteredMqttThings.init();
      thingSources.push(selfRegisteredMqttThings);
   } catch (e) {
      console.log(`Cannot init SelfRegisteredMqttThings. Reason: ${e}`);
   }

   try {
      const bluetoothThermostats = new BluetoothEq3Thermostats(registeredThings, bluetoothThings.things);
      await bluetoothThermostats.init();
      thingSources.push(bluetoothThermostats);
   } catch (e) {
      console.log(`Cannot init BluetoothEq3Thermostats. Reason: ${e}`);
   }

   try {
      const configuredMqttThings = new ManualRegisteredMqttThings(registeredThings, mqttClient, mqttThings.things);
      await configuredMqttThings.init();
      thingSources.push(configuredMqttThings);
   } catch (e) {
      console.log(`Cannot init ManualRegisteredMqttThings. Reason: ${e}`);
   }

   const app = express();
   app.use(bodyParser.json())
   app.use(morgan('tiny'));
   app.use(cors());
   app.use('/api', apiRouter(new CollectedThings(thingSources), dashboards, thingGroups, recordingConfigs, automationConfigs));
   app.listen(port, () => console.log(`Listening on port ${port}`));
}

run();

