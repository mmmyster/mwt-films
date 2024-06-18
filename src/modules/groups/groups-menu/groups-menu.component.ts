import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-groups-menu',
  standalone: true,
  imports: [RouterOutlet, MaterialModule, RouterLink, RouterLinkActive],
  templateUrl: './groups-menu.component.html',
  styleUrl: './groups-menu.component.css'
})
export class GroupsMenuComponent {

}
