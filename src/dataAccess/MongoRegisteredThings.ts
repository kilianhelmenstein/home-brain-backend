import { MongoClient, ObjectId } from 'mongodb';

import { IRegisteredThings, RegisteredThing } from '../domain/IRegisteredThings'

type MongoRegisteredThing = {
   _id: ObjectId;
   key: string;
   name: string;
}

export class MongoRegisteredThings implements IRegisteredThings {
   private collection = 'registered_things';

   constructor(private mongoUrl: string, private databaseName: string) {
   }
   
   async add(key: string, defaultName: string): Promise<RegisteredThing> {
      const client = await MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true });
      try {
         const database = client.db(this.databaseName);
         const thingCollection = database.collection<MongoRegisteredThing>(this.collection);
         const thing = await thingCollection.findOne({ key });
         
         const isThingAlreadyRegisterd = thing !== undefined;
         if (isThingAlreadyRegisterd) {
            return new RegisteredThing(thing._id.toHexString(), thing.name);
         }
         else {
            const nowRegisteredThing = await thingCollection.insertOne({ key, name: defaultName });
            return new RegisteredThing(nowRegisteredThing.insertedId.toHexString(), defaultName);
         }
      } finally {
         client.close();
      }
   }
}