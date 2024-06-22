import { Person } from "./person";
import { Postava } from "./postava";

export class Film {
  static clone(film: Film): Film {
    return new Film(
      film.nazov,
      film.rok,
      film.slovenskyNazov,
      film.imdbID,
      film.reziser,
      film.postava,
      film.poradieVRebricku,
      film.id
    );
  }
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