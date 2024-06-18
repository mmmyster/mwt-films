import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { Group } from '../../../entities/group';
import { MaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-group-edit-child',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './group-edit-child.component.html',
  styleUrl: './group-edit-child.component.css'
})
export class GroupEditChildComponent implements OnChanges {
  @Input() group: Group = new Group("");
  @Input() saveToServer: boolean = false;
  @Output() groupChange = new EventEmitter<Group>();
  usersService = inject(UsersService);
  groupName = '';
  permissions = '';

  ngOnChanges(changes: SimpleChanges): void {
      this.groupName = this.group.name;
      this.permissions = this.group.permissions.join(', ');
  }

  submit() {
    const perms = this.permissions.split(',').map(per => per.trim()).filter(per => per.length > 0);
    const groupToSave =  new Group(this.groupName, perms, this.group.id);
    if (this.saveToServer) {
      this.usersService.saveGroup(groupToSave).subscribe(savedGroup =>{
        this.groupChange.emit(savedGroup);
      });
    } else {
      this.groupChange.emit(groupToSave);
    }
  }
}
