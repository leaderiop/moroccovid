import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Store } from '@ngxs/store';
import {
  UserLoginAction,
  UserGetAllUsersAction,
  UserConnectWithUserAction,
  UserRemoveUserAction,
} from 'src/app/store/actions/user.actions';
import { UserModel } from 'src/app/store/models/user.model';
import { ErrorResponseModel } from '../../store/models/error/error-response.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  USER: UserModel;
  USERS: UserModel[] = [];
  IS_LOADING: boolean = false;
  public form: FormGroup;

  validation_messages = {
    username: {
      required: 'Username is required.',
      minlength: 'user min length is 4',
    },
    password: {
      required: 'Password is required.',
      minlength: 'password min length is 6',
    },
  };
  constructor(private readonly fb: FormBuilder, private readonly store: Store) {
    this.store.dispatch(new UserGetAllUsersAction());
  }

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
    });

    this.store
      .select(state => state.user.USER)
      .subscribe(USER => {
        this.USER = USER;
        this.IS_LOADING = false;
      });
    this.store
      .select(state => state.user.USERS)
      .subscribe(USERS => {
        console.log(USERS);
        this.USERS = USERS;
      });
    this.store
      .select(state => state.user.LOGGING_ERRORS)
      .subscribe((LOGGING_ERRORS: ErrorResponseModel) => {
        this.IS_LOADING = false;
        if (LOGGING_ERRORS)
          if (LOGGING_ERRORS.message)
            for (const err of LOGGING_ERRORS.message) {
              this.form.get(err.property).setErrors(err.constraints);
            }
      });
  }

  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }

  submit() {
    this.store.dispatch(
      new UserLoginAction({
        username: this.username.value,
        password: this.password.value,
      }),
    );
    this.IS_LOADING = true;
  }
  connect(user: UserModel) {
    this.store.dispatch(new UserConnectWithUserAction(user));
  }

  delete(user: UserModel) {
    this.store.dispatch(new UserRemoveUserAction(user));
  }
}
