import { MongoClient, ObjectId } from 'mongodb';
import { Id } from '../domain/Id';

import { IThingGroups, ThingGroup } from '../domain/IThingGroups';

type MongoThingGroup = {
   _id: ObjectId;
   name: string;
   thingIds: Id[];
}
 
export class MongoThingGroups implements IThingGroups {
   private collection = 'recording_configs';

   constructor(private mongoUrl: string, private databaseName: string) {
   }

   async all(): Promise<ThingGroup[]> {
      const client = await MongoClient.connect(this.mongoUrl);
      try {
         const database = client.db(this.databaseName);
         const groupCollection = database.collection<MongoThingGroup>(this.collection);
         const groups = await groupCollection.find().toArray();
         return groups.map(g => new ThingGroup(g._id.toHexString(), g.name, g.thingIds));
      } finally {
         client.close();
      }
   }

   async add(name: string, thingIds: Id[]): Promise<ThingGroup> {
      const client = await MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true });
      try {
         const database = client.db(this.databaseName);
         const collection = database.collection<MongoThingGroup>(this.collection);
         const addedGroup = await collection.insertOne({ name, thingIds });
         return new ThingGroup(addedGroup.insertedId.toHexString(), name, thingIds);
      } finally {
         client.close();
      }
   }

   async update(group: ThingGroup): Promise<ThingGroup> {
      const client = await MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true });
      try {
         const database = client.db(this.databaseName);
         const collection = database.collection<MongoThingGroup>(this.collection);
         await collection.replaceOne(
            { _id: ObjectId.createFromHexString(group.id) },
            { _id: ObjectId.createFromHexString(group.id), name: group.name, thingIds: group.thingIds });

         return new ThingGroup(group.id, group.name, group.thingIds);
      } finally {
         client.close();
      }
   }
   
   async remove(id: Id): Promise<void> {
      const client = await MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true });
      try {
         const database = client.db(this.databaseName);
         const collection = database.collection<MongoThingGroup>(this.collection);
         await collection.deleteOne({ _id: ObjectId.createFromHexString(id) });
      } finally {
         client.close();
      }
   }
}