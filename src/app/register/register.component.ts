import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import { Observable, map } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { User } from '../../entities/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export default class RegisterComponent {
  hide = true;
  passwordMessage = '';
  
  passwordValidator = (model: AbstractControl): ValidationErrors | null => {
    const result = zxcvbn(model.value);
    this.passwordMessage = "Password score: " + result.score +" of 4, breakable in " + result.crackTimesDisplay.offlineSlowHashing1e4PerSecond;
    
    if (result.score > 2) {
      return null;
    }
    return {weakPassword: this.passwordMessage};
  }
  registerForm = new FormGroup({
    login: new FormControl('',{
      validators: [Validators.required, Validators.minLength(3)],
      asyncValidators: this.userConfictsValidator('login')
    }),
    email: new FormControl('',[Validators.required, 
                               Validators.email, 
                      Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$")], this.userConfictsValidator('email')),
    password: new FormControl('', this.passwordValidator),
    password2: new FormControl('')
  }, this.samePasswordsValidator);

  constructor(private usersService: UsersService){
    const options = {
      translations: zxcvbnEnPackage.translations,
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
    }
    zxcvbnOptions.setOptions(options);
  }

  samePasswordsValidator(model: AbstractControl): ValidationErrors | null {
    const password = model.get('password')?.value;
    const password2model = model.get('password2');
    const password2 = password2model?.value;
    if (password === password2) {
      password2model?.setErrors(null);
      return null;
    }
    const err = {differentPasswords: 'Passwords are different'}
    password2model?.setErrors(err);
    return err;
  }

  userConfictsValidator(field: string): AsyncValidatorFn {
    return (model: AbstractControl): Observable<ValidationErrors | null> => {
      const name = field === 'login' ? model.value: '';
      const email = field === 'email' ? model.value : '';
      const user = new User(name, email);
      return this.usersService.userConflicts(user).pipe(
        map(conflicts => {
          if (conflicts.length === 0) 
            return null;
          return {serverConflict: field + " is already present on server"}
        })
      );
    }
  }

  submit() {
    const user = new User(this.login.value, 
                          this.email.value,
                          undefined,
                          undefined,
                          this.password.value);
    this.usersService.register(user).subscribe();
  }

  get login():FormControl<string> {
    return this.registerForm.get('login') as FormControl<string>;
  }
  get email():FormControl<string> {
    return this.registerForm.get('email') as FormControl<string>;
  }
  get password():FormControl<string> {
    return this.registerForm.get('password') as FormControl<string>;
  }
}
