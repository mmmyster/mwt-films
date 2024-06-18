import { Routes } from '@angular/router';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupsMenuComponent } from './groups-menu/groups-menu.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { authGuard } from '../../guards/auth.guard';
import { canDeactivateGuard } from '../../guards/can-deactivate.guard';
import { resolveGroupGuard } from '../../guards/resolve-group.guard';

export const routes: Routes = [
  {path : '', component: GroupsMenuComponent, children:[
    {path: '', component: GroupsListComponent},
    {path: 'new', component: GroupEditComponent},
    {path: 'edit/:id', 
     component: GroupEditComponent, 
     canActivate:[authGuard],
     canDeactivate:[canDeactivateGuard]
    },
    {path: 'detail/:id', 
     component: GroupDetailComponent, 
     resolve: {
      group: resolveGroupGuard
     },
     data: {
      blbost: "hahaha"
     }
    }
  ]}
];
