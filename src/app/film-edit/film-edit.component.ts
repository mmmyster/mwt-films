import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { map, of, switchMap, tap } from 'rxjs';
import { FilmsService } from '../../services/films.service';
import { Film } from '../../entities/film';
import {
  FormControl,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Person } from '../../entities/person';
import { Postava } from '../../entities/postava';

@Component({
  selector: 'app-film-edit',
  standalone: true,
  imports: [MaterialModule, RouterLink, ReactiveFormsModule],
  templateUrl: './film-edit.component.html',
  styleUrl: './film-edit.component.css',
})
export class FilmEditComponent implements OnInit {
  route = inject(ActivatedRoute);
  filmsService = inject(FilmsService);
  filmId?: number;
  film = new Film('', 0, '', '', [], [], {});
  editForm = new FormGroup({
    nazov: new FormControl('', Validators.required),
    rok: new FormControl(0, [
      Validators.required,
      Validators.min(1895),
      Validators.max(new Date().getFullYear()),
    ]),
    slovenskyNazov: new FormControl(''),
    imdbID: new FormControl(''),
    reziser: new FormArray([]),
    postava: new FormArray([]),
    poradieVRebricku: new FormGroup({
      'AFI 1998': new FormControl(null, Validators.min(1)),
      'AFI 2007': new FormControl(null, Validators.min(1)),
    }),
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        tap((id) => (this.filmId = id)),
        switchMap((id) =>
          id
            ? this.filmsService.getFilm(id)
            : of(new Film('', 0, '', '', [], [], {}))
        )
      )
      .subscribe((film) => {
        this.film = film;
        this.editForm.patchValue({
          nazov: film.nazov,
          rok: film.rok,
          slovenskyNazov: film.slovenskyNazov,
          imdbID: film.imdbID,
          poradieVRebricku: film.poradieVRebricku,
        });

        const reziserArray = this.editForm.get('reziser') as FormArray;
        reziserArray.clear();
        film.reziser.forEach((person) => {
          reziserArray.push(this.createPersonFormGroup(person));
        });

        const postavaArray = this.editForm.get('postava') as FormArray;
        postavaArray.clear();
        film.postava.forEach((postava) => {
          postavaArray.push(this.createPostavaFormGroup(postava));
        });
      });
  }

  createPersonFormGroup(person: Person): FormGroup {
    return new FormGroup({
      id: new FormControl(person.id),
      krstneMeno: new FormControl(person.krstneMeno),
      stredneMeno: new FormControl(person.stredneMeno),
      priezvisko: new FormControl(person.priezvisko),
    });
  }

  createPostavaFormGroup(postava: Postava): FormGroup {
    return new FormGroup({
      postava: new FormControl(postava.postava),
      dolezitost: new FormControl(postava.dolezitost),
      herec: this.createPersonFormGroup(postava.herec),
    });
  }

  submit() {
    if (this.editForm.valid) {
      this.film.nazov = this.nazov.value.trim();
      this.film.rok = this.rok.value;
      this.film.slovenskyNazov = this.slovenskyNazov.value.trim();
      this.film.imdbID = this.imdbID.value.trim();

      const reziserArray = this.editForm.get('reziser') as FormArray;
      this.film.reziser = reziserArray.controls.map((control) => control.value);

      const postavaArray = this.editForm.get('postava') as FormArray;
      this.film.postava = postavaArray.controls.map((control) => control.value);

      // check if poradieVRebricku children exist and have values
      const poradieGroup = this.editForm.get('poradieVRebricku') as FormGroup;

      const afi1998Control = poradieGroup.get('AFI 1998');
      const afi2007Control = poradieGroup.get('AFI 2007');

      const poradieVRebricku: any = {};

      if (afi1998Control && afi1998Control.value !== null) {
        poradieVRebricku['AFI 1998'] = afi1998Control.value;
      }
      if (afi2007Control && afi2007Control.value !== null) {
        poradieVRebricku['AFI 2007'] = afi2007Control.value;
      }

      this.film.poradieVRebricku = poradieVRebricku;

      this.filmsService.saveFilm(this.film).subscribe();
    }
  }

  get nazov(): FormControl {
    return this.editForm.get('nazov') as FormControl;
  }
  get rok(): FormControl {
    return this.editForm.get('rok') as FormControl;
  }
  get slovenskyNazov(): FormControl {
    return this.editForm.get('slovenskyNazov') as FormControl;
  }
  get imdbID(): FormControl {
    return this.editForm.get('imdbID') as FormControl;
  }
  get reziser(): FormArray {
    return this.editForm.get('reziser') as FormArray;
  }
  get postava(): FormArray {
    return this.editForm.get('postava') as FormArray;
  }
  get poradieVRebricku(): FormGroup {
    return this.editForm.get('poradieVRebricku') as FormGroup;
  }
}
