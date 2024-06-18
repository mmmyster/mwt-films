import { Pipe, PipeTransform } from '@angular/core';
import { Group } from '../entities/group';

@Pipe({
  name: 'groupsToString',
  standalone: true
})
export class GroupsToStringPipe implements PipeTransform {

  transform(groups: Group[], option?: string): string {
    if (option === 'perms') {
      return groups.map(group => group.permissions)
                   .flat()
                   .reduce((acc:string[], p) => acc.includes(p) ? acc : [...acc, p], [])
                   .join(', ');
    } else {
      return groups.map(group => group.name).join(', ');
    }
  }

}
