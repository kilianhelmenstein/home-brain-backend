import { MongoClient, ObjectId } from 'mongodb';

import { IKnownThings, KnownThing } from '../domain/IKnownThings'

type MongoKnownThing = {
   _id: ObjectId;
   key: string;
   name: string;
}

export class MongoKnownThings implements IKnownThings {
   private collection = 'known_things';

   constructor(private mongoUrl: string, private databaseName: string) {
   }
   
   async add(key: string, defaultName: string): Promise<KnownThing> {
      const client = await MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true });
      try {
         const database = client.db(this.databaseName);
         const thingCollection = database.collection<MongoKnownThing>(this.collection);
         const thing = await thingCollection.findOne({ key });
         
         const isThingAlreadyRegisterd = thing !== undefined;
         if (isThingAlreadyRegisterd) {
            return new KnownThing(thing._id.toHexString(), thing.name);
         }
         else {
            const nowKnownThing = await thingCollection.insertOne({ key, name: defaultName });
            return new KnownThing(nowKnownThing.insertedId.toHexString(), defaultName);
         }
      } finally {
         client.close();
      }
   }
}