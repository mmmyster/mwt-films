import { Person } from "./person";

export class Postava {
  constructor(
    public postava: string,
    public dolezitost: "hlavná postava" | "vedľajšia postava",
    public herec: Person
  ){}
}