import { Id } from './Id'
import { IThing } from './IThing'

export interface IThings {
   all(): Promise<IThing[]>;
   one(id: Id): Promise<IThing | undefined>;
}