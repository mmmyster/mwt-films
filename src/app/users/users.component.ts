import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../../entities/user';
import { UsersService } from '../../services/users.service';
import { MaterialModule } from '../../modules/material.module';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users:User[]=[new User('Hanka','hanka@upjs.sk', 2, new Date(),'qwerty'),
                new User('Julka', 'julka@upjs.sk', 3, undefined, 'heslo'),
                {name:"Ferko", email:'ferko@gmail.com', password:'', groups:[]}];
  selectedUser?: User;
  // errorMessage = '';
  columnsToDisplay = ['id','name','email'];

  constructor(private usersService: UsersService){}

  ngOnInit(): void {
    // voláme service-né metódy
    this.usersService.getUsers().subscribe({
      next: u => this.users = u,
      error: error => {
        // this.errorMessage = "Chyba komunikácie so serverom";
        console.error("chyba:", error);
      }
    });
  }

  selectUser(user: User) {
    this.selectedUser = user;
  }
}
