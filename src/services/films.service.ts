import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { Film } from '../entities/film';
import { UsersService } from './users.service';
import { environment } from '../environments/environment';
import { MessageService } from './message.service';
import { Router } from '@angular/router';

export interface FilmsResponse {
  items: Film[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class FilmsService {
  usersService = inject(UsersService);
	messageService = inject(MessageService);
	router = inject(Router);
  http = inject(HttpClient);
  url = environment.serverUrl;
  get token() {
    return this.usersService.token;
  }

  getTokenHeader(): {headers?: {[header: string]: string}, 
                     params?: HttpParams} | undefined {
    if (!this.token) {
      return undefined;
    }
    return { headers: {'X-Auth-Token': this.token}};
  }

 getFilm(id: number): Observable<Film> {
		let options = this.getTokenHeader();
    return this.http.get<Film>(this.url + 'films/' + id, options).pipe(
      map(jsonFilm => Film.clone(jsonFilm)),
      catchError(err => this.usersService.processError(err))
    );
  }

  saveFilm(film: Film): Observable<Film> {
    let options = this.getTokenHeader();
    return this.http.post<Film>(this.url + 'films/', film, options).pipe(
      map((jsonFilm) => Film.clone(jsonFilm)),
      tap((user) =>
        this.messageService.success('Film ' + film.nazov + ' saved')
      ),
      tap((user) => this.router.navigateByUrl('/films')),
      catchError((err) => this.usersService.processError(err))
    );
  }
  getFilms(orderBy?:string, descending?: boolean, indexFrom?: number, indexTo?: number, search?: string): Observable<FilmsResponse> {
    let options = this.getTokenHeader();
    if (orderBy || descending || indexFrom || indexTo || search) {
      options = { ...(options || {}), params: new HttpParams()};
    }
    if (options && options.params) {
      if (orderBy) {
        options.params = options.params.set('orderBy', orderBy);
      }
      if (descending) {
        options.params = options.params.set('descending', descending);
      }
      if (indexFrom) {
        options.params = options.params.set('indexFrom', indexFrom);
      }
      if (indexTo) {
        options.params = options.params.set('indexTo', indexTo);
      }
      if (search) {
        options.params = options.params.set('search', search);
      }
    }
    return this.http.get<FilmsResponse>(this.url + 'films', options).pipe(
      catchError(err => this.usersService.processError(err))
    );
  }
}
