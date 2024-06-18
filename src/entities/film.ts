import { Person } from "./person";
import { Postava } from "./postava";

export class Film {
  constructor(
    public nazov: string,
    public rok: number,
    public slovenskyNazov: string,
    public imdbID: string,
    public reziser: Person[],
    public postava: Postava[],
    public poradieVRebricku: {[name: string]: number},
    public id?: number
  ){}
}