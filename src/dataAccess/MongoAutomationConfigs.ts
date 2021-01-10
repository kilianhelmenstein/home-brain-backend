import { MongoClient, ObjectId } from 'mongodb';
import { Id } from '../domain/Id';

import { IAutomationConfigs, AutomationConfig, IntervallOfExecution, TimeOfExecution } from '../domain/IAutomationConfigs';

type MongoAutomation = {
   _id: ObjectId;
   execution: IntervallOfExecution | TimeOfExecution;
   thingId: Id;
   command: string;
   commandParameter: string;
}

export class MongoAutomationConfigs implements IAutomationConfigs {
   private collection = 'automation_configs';

   constructor(private mongoUrl: string, private databaseName: string) {
   }
   
   async all(): Promise<AutomationConfig[]> {
      const client = await MongoClient.connect(this.mongoUrl);
      try {
         const database = client.db(this.databaseName);
         const configsCollection = database.collection<MongoAutomation>(this.collection);
         const configs = await configsCollection.find().toArray();
         return configs.map(c => new AutomationConfig(c._id.toHexString(), c.execution, c.thingId, c.command, c.commandParameter));
      } finally {
         client.close();
      }
   }

   async forThing(thingId: Id): Promise<AutomationConfig[]> {
      const client = await MongoClient.connect(this.mongoUrl);
      try {
         const database = client.db(this.databaseName);
         const configsCollection = database.collection<MongoAutomation>(this.collection);
         const configs = await configsCollection.find({ thingId }).toArray();
         return configs.map(c => new AutomationConfig(c._id.toHexString(), c.execution, c.thingId, c.command, c.commandParameter));
      } finally {
         client.close();
      }
   }

   async add(config: AutomationConfig): Promise<AutomationConfig | undefined> {
      const isInvalidId = config.id !== '';
      if (isInvalidId)
         return undefined;

      const client = await MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true });
      try {
         const database = client.db(this.databaseName);
         const configsCollection = database.collection<MongoAutomation>(this.collection);
         await configsCollection.insertOne({
            execution: config.execution,
            thingId: config.thingId,
            command: config.command,
            commandParameter: config.commandParameter
          });
         return config;
      } finally {
         client.close();
      }
   }

   async update(config: AutomationConfig): Promise<AutomationConfig> {
      const client = await MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true });
      try {
         const database = client.db(this.databaseName);
         const configsCollection = database.collection<MongoAutomation>(this.collection);
         const existingConfig = await configsCollection.findOne({ _id: ObjectId.createFromHexString(config.id) });
         
         if (existingConfig)
            await configsCollection.replaceOne(
               { thingId: config.thingId }, 
               {
                  _id: existingConfig._id,
                  execution: config.execution,
                  thingId: config.thingId,
                  command: config.command,
                  commandParameter: config.commandParameter
                });
         else
            await configsCollection.insertOne(config);
         return config;
      } finally {
         client.close();
      }
   }

   async remove(id: Id): Promise<void> {
      const client = await MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true });
      try {
         const database = client.db(this.databaseName);
         const configsCollection = database.collection<MongoAutomation>(this.collection);
         await configsCollection.deleteOne({ _id: ObjectId.createFromHexString(id) });
      } finally {
         client.close();
      }
   }
}