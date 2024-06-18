import { ResolveFn } from "@angular/router";
import { Group } from "../entities/group";
import { EMPTY } from "rxjs";
import { inject } from "@angular/core";
import { UsersService } from "../services/users.service";

export const resolveGroupGuard: ResolveFn<Group> = (route, state) => {
  const id = Number(route.paramMap.get('id'));
  if (! id) {
    return EMPTY;
  }
  const usersService = inject(UsersService);
  return usersService.getGroup(id);
}