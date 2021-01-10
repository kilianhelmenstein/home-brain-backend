import { MongoClient } from 'mongodb';
import { Id } from '../domain/Id';

import { IAutomationConfigs, AutomationConfig } from '../domain/IAutomationConfigs';

export class MongoAutomationConfigs implements IAutomationConfigs {
   private collection = 'automation_configs';

   constructor(private mongoUrl: string, private databaseName: string) {
   }
   
   async all(): Promise<AutomationConfig[]> {
      const client = await MongoClient.connect(this.mongoUrl);
      try {
         const database = client.db(this.databaseName);
         const configsCollection = database.collection<AutomationConfig>(this.collection);
         const config = await configsCollection.find().toArray();
         return config;
      } finally {
         client.close();
      }
   }

   async forThing(thingId: Id): Promise<AutomationConfig[]> {
      const client = await MongoClient.connect(this.mongoUrl);
      try {
         const database = client.db(this.databaseName);
         const configsCollection = database.collection<AutomationConfig>(this.collection);
         const configs = await configsCollection.find({ thingId }).toArray();
         return configs;
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
         const configsCollection = database.collection<AutomationConfig>(this.collection);
         await configsCollection.insertOne(config);
         return config;
      } finally {
         client.close();
      }
   }

   async update(config: AutomationConfig): Promise<AutomationConfig> {
      const client = await MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true });
      try {
         const database = client.db(this.databaseName);
         const configsCollection = database.collection<AutomationConfig>(this.collection);
         const existingConfig = configsCollection.findOne({ thingId: config.thingId });
         
         if (existingConfig)
            await configsCollection.replaceOne({ thingId: config.thingId }, config);
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
         const configsCollection = database.collection<AutomationConfig>(this.collection);
         await configsCollection.deleteOne({ _id: id });
      } finally {
         client.close();
      }
   }
}