import { IThing } from './IThing';
import { IThings } from './IThings'
import { Id } from './Id'

export class CollectedThings implements IThings {
   constructor(private sources: IThings[]) {
   }
   
   async all(): Promise<IThing[]> {
      const subsets = await Promise.all(this.sources.map(source => source.all()));
      const combinedSubsets = subsets.reduce((left, right) => left.concat(right));
      return combinedSubsets;
   }

   async one(id: Id): Promise<IThing | undefined> {
      for (const source of this.sources) {
         const oneOfSource = await source.one(id);
         if (oneOfSource)
            return oneOfSource;
      }

      return undefined;
   }

}