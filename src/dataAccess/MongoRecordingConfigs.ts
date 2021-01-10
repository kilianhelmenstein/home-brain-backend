import { MongoClient, ObjectId } from 'mongodb';
import { Id } from '../domain/Id';
import { Seconds } from '../domain/Time';

import { IRecordingConfigs, RecordingConfig } from '../domain/IRecordingConfigs';

type MongoRecordingConfig = {
   _id: ObjectId;
   thingId: Id;
   dataNames: string[];
   intervall: Seconds;
   lifetime: Seconds;
}
 
export class MongoRecordingConfigs implements IRecordingConfigs {
   private collection = 'recording_configs';

   constructor(private mongoUrl: string, private databaseName: string) {
   }
   
   async all(): Promise<RecordingConfig[]> {
      const client = await MongoClient.connect(this.mongoUrl);
      try {
         const database = client.db(this.databaseName);
         const configsCollection = database.collection<MongoRecordingConfig>(this.collection);
         const configs = await configsCollection.find().toArray();
         return configs.map(c => new RecordingConfig(c._id.toHexString(), c.thingId, c.dataNames, c.intervall, c. lifetime));
      } finally {
         client.close();
      }
   }

   async forThing(thingId: Id): Promise<RecordingConfig> {
      const client = await MongoClient.connect(this.mongoUrl);
      try {
         const database = client.db(this.databaseName);
         const configs = database.collection<MongoRecordingConfig>(this.collection);
         const config = await configs.findOne({ thingId });
         return new RecordingConfig(config._id.toHexString(), config.thingId, config.dataNames, config.intervall, config.lifetime);
      } finally {
         client.close();
      }
   }

   async addOrUpdate(config: RecordingConfig): Promise<RecordingConfig> {
      const client = await MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true });
      try {
         const database = client.db(this.databaseName);
         const configsCollection = database.collection<MongoRecordingConfig>(this.collection);
         const existingConfig = configsCollection.findOne({ thingId: config.thingId });
         
         if (existingConfig)
            await configsCollection.replaceOne(
               { thingId: config.thingId },
               {
                  _id: ObjectId.createFromHexString(config.id),
                  thingId: config.thingId,
                  dataNames: config.dataNames,
                  intervall: config.intervall,
                  lifetime: config.lifetime
               });
         else
            await configsCollection.insertOne({
               thingId: config.thingId,
               dataNames: config.dataNames,
               intervall: config.intervall,
               lifetime: config.lifetime
            });
         return config;
      } finally {
         client.close();
      }
   }

   async remove(id: Id): Promise<void> {
      const client = await MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true });
      try {
         const database = client.db(this.databaseName);
         const configsCollection = database.collection<MongoRecordingConfig>(this.collection);
         await configsCollection.deleteOne({ _id: ObjectId.createFromHexString(id) });
      } finally {
         client.close();
      }
   }
}