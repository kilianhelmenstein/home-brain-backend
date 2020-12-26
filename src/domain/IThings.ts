import { IThing } from './IThing'

export interface IThings {
   all(): Promise<IThing[]>;
   one(id: number): Promise<IThing | undefined>;
}