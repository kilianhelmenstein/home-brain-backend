import { MongoClient, ObjectId } from 'mongodb';
import { Id } from '../domain/Id';

import { IDashboards } from '../domain/IDashboards';

type MongoDashboard = {
   _id: ObjectId;
   userId: Id;
   thingIds: Id[];
}
 
export class MongoDashboards implements IDashboards {
   private collection = 'dashboards';

   constructor(private mongoUrl: string, private databaseName: string) {
   }

   async thingIds(userId: Id): Promise<Id[]> {
      const client = await MongoClient.connect(this.mongoUrl);
      try {
         const database = client.db(this.databaseName);
         const dashboards = database.collection<MongoDashboard>(this.collection);
         const dashboard = await dashboards.findOne({ userId });

         if (dashboard)
            return dashboard.thingIds;
         else
            return [];
      } finally {
         client.close();
      }
   }

   async appendThing(userId: Id, thingId: Id): Promise<void> {
      const client = await MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true });
      try {
         const database = client.db(this.databaseName);
         const dashboards = database.collection<MongoDashboard>(this.collection);
         const dashboard = await dashboards.findOne({ userId });
         
         if (dashboard) {
            const isThingAlreadyContained = dashboard.thingIds.includes(thingId)
            if (isThingAlreadyContained)
               return;

            const resultingThingIds = dashboard.thingIds.concat([thingId]);
            await dashboards.replaceOne(
               { userId: userId },
               { _id: dashboard._id, userId, thingIds: resultingThingIds });
         } else {
            await dashboards.insertOne({ userId, thingIds: [thingId]});
         }
      } finally {
         client.close();
      }
   }

   async removeThing(userId: Id, thingId: Id): Promise<void> {
      const client = await MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true });
      try {
         const database = client.db(this.databaseName);
         const dashboards = database.collection<MongoDashboard>(this.collection);
         const dashboard = await dashboards.findOne({ userId: userId });
         
         if (dashboard) {
            const isNotContained = !dashboard.thingIds.includes(thingId)
            if (isNotContained) 
               return;
            
            const resultingThingIds = dashboard.thingIds.filter(id => id !== thingId);
            await dashboards.replaceOne(
               { userId: userId },
               { _id: dashboard._id, userId, thingIds: resultingThingIds });
         } else {
            console.log('Canot find dashbaord for userid: ', userId);
         }
      } finally {
         client.close();
      }
   }
}