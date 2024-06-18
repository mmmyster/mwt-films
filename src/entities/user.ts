import { Group } from "./group";

export class User {
  static clone(user: User): User {
    return new User(user.name, 
                    user.email, 
                    user.id, 
                    user.lastLogin ? new Date(user.lastLogin): undefined, 
                    user.password || '',
                    user.active,
                    user.groups?.map(group => Group.clone(group)) || []);
  }

  constructor(
    public name: string,
    public email: string,
    public id?: number,
    public lastLogin?: Date,
    public password = '',
    public active?: boolean,
    public groups: Group[] = []
  ){}

  toString() {
    return this.id + ': ' +this.name + ', ' + this.email + ', groups: ' 
           + this.groups.map(g => g.name);
  }
}