import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { Group } from '../../../entities/group';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-groups-list',
  standalone: true,
  imports: [RouterLink, MaterialModule],
  templateUrl: './groups-list.component.html',
  styleUrl: './groups-list.component.css'
})
export class GroupsListComponent implements OnInit{
  usersService = inject(UsersService);
  groups: Group[] = [];

  ngOnInit(): void {
      this.usersService.getGroups().subscribe(groups => this.groups = groups);
  }
}
