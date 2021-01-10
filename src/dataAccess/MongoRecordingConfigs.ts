import { MongoClient } from 'mongodb';
import { Id } from '../domain/Id';

import { IRecordingConfigs, RecordingConfig } from '../domain/IRecordingConfigs';

export class MongoRecordingConfigs implements IRecordingConfigs {
   private collection = 'recording_configs';

   constructor(private mongoUrl: string, private databaseName: string) {
   }
   
   async all(): Promise<RecordingConfig[]> {
      const client = await MongoClient.connect(this.mongoUrl);
      try {
         const database = client.db(this.databaseName);
         const configsCollection = database.collection<RecordingConfig>(this.collection);
         const config = await configsCollection.find().toArray();
         return config;
      } finally {
         client.close();
      }
   }

   async forThing(thingId: Id): Promise<RecordingConfig> {
      const client = await MongoClient.connect(this.mongoUrl);
      try {
         const database = client.db(this.databaseName);
         const configs = database.collection<RecordingConfig>(this.collection);
         const config = await configs.findOne({ thingId });
         return config;
      } finally {
         client.close();
      }
   }

   async addOrUpdate(config: RecordingConfig): Promise<RecordingConfig> {
      const client = await MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true });
      try {
         const database = client.db(this.databaseName);
         const configsCollection = database.collection<RecordingConfig>(this.collection);
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

   async remove(thingId: Id): Promise<void> {
      const client = await MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true });
      try {
         const database = client.db(this.databaseName);
         const configsCollection = database.collection<RecordingConfig>(this.collection);
         await configsCollection.deleteOne({ thingId });
      } finally {
         client.close();
      }
   }
}