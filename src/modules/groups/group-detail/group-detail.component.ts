import { Component, OnInit, inject } from '@angular/core';
import { Group } from '../../../entities/group';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.css'
})
export class GroupDetailComponent implements OnInit{
  route = inject(ActivatedRoute);
  group!: Group;

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.group = data['group'];
    })
  }
}
