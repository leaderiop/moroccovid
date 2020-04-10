import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Store } from '@ngxs/store';
import { PhoneValidator } from '../../helpers/validators/phone.validator';
import { UserRegisterAction } from 'src/app/store/actions/user.actions';
import { ErrorResponseModel } from 'src/app/store/models/error/error-response.model';
import { Navigate } from '@ngxs/router-plugin';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  IS_LOADING: boolean = false;
  public form: FormGroup;
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
  ) {}
  validation_messages = {
    username: {
      required: 'username is required.',
      minlength: 'user min length is 4',
    },
    password: {
      required: 'password is required.',
      minlength: 'password min length is 6',
    },
    firstName: {
      required: 'firstName is required.',
    },
    lastName: {
      required: 'lastName is required.',
    },
    email: {
      required: 'email is required.',
      email: 'email phone',
    },
    phone: {
      required: 'phone is required.',
      validCountryPhone: 'phone have been',
    },
  };
  ngOnInit() {
    this.form = this.fb.group({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        PhoneValidator.validCountryPhone(),
      ]),
    });
    this.store
      .select(state => state.user.REGISTER_ERRORS)
      .subscribe((REGISTER_ERRORS: ErrorResponseModel) => {
        this.IS_LOADING = false;
        if (REGISTER_ERRORS)
          if (REGISTER_ERRORS.message)
            for (const err of REGISTER_ERRORS.message) {
              this.form.get(err.property).setErrors(err.constraints);
            }
      });
  }
  submit() {
    this.store.dispatch(
      new UserRegisterAction({
        email: this.email.value,
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        password: this.password.value,
        phone: this.phone.value,
        username: this.username.value,
      }),
    );
    this.IS_LOADING = true;
  }

  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }

  get firstName() {
    return this.form.get('firstName');
  }
  get lastName() {
    return this.form.get('lastName');
  }

  get email() {
    return this.form.get('email');
  }
  get phone() {
    return this.form.get('phone');
  }
  goToRegister() {
    this.store.dispatch(new Navigate(['/login']));
  }
}
