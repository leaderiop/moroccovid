import { State, Action, StateContext } from '@ngxs/store';
import {
  UserLoginAction,
  UserLoginFailAction,
  UserLoginSuccessAction,
  UserLogoutAction,
  UserRegisterAction,
  UserRegisterSuccessAction,
  UserRegisterFailAction,
  UserSaveAction,
  UserGetAllUsersAction,
  UserConnectWithUserAction,
  UserRemoveUserAction,
} from '../actions/user.actions';
import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';
import { Navigate } from '@ngxs/router-plugin';
import { ErrorResponseModel } from '../models/error/error-response.model';
import { UserModel as User } from 'src/app/database/models/user.model';
import { DatabaseService } from 'src/app/database/services/database.service';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { TrackingStopWatchingAction } from '../actions/tracking.actions';
class UserStateModel {
  USER: User;
  USERS: User[];
  LOGGING_ERRORS: ErrorResponseModel;
  REGISTER_ERRORS: ErrorResponseModel;
}
@State<UserStateModel>({
  name: 'user',
  defaults: {
    USER: null,
    LOGGING_ERRORS: null,
    REGISTER_ERRORS: null,
    USERS: [],
  },
})
export class UserState {
  constructor(
    private readonly userService: UserService,
    private readonly databaseService: DatabaseService,
  ) {}
  @Action(UserLoginAction)
  UserLoginAction(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: UserLoginAction,
  ) {
    this.userService.login(payload).subscribe(
      result => {
        dispatch(new UserLoginSuccessAction(result));
      },
      err => {
        dispatch(new UserLoginFailAction(err.error));
      },
    );
  }

  @Action(UserLoginSuccessAction)
  UserLoginSuccessAction(
    { dispatch, patchState }: StateContext<UserStateModel>,
    { payload }: UserLoginSuccessAction,
  ) {
    dispatch(new UserSaveAction(payload));
  }
  @Action(UserSaveAction)
  async UserSaveAction(
    { dispatch, patchState }: StateContext<UserStateModel>,
    { payload }: UserSaveAction,
  ) {
    const repo = this.databaseService.getUserRepository();
    let user = await repo.findOne({ where: { _id: payload._id } });
    if (user) {
    } else {
      const userTmp = repo.create(payload);
      user = await repo.save(userTmp);
    }
    patchState({ USER: user, LOGGING_ERRORS: null });
    dispatch(new Navigate(['/tracking']));
    dispatch(new UserGetAllUsersAction());
  }

  @Action(UserLoginFailAction)
  UserLoginFailAction(
    { patchState }: StateContext<UserStateModel>,
    { payload }: UserLoginFailAction,
  ) {
    patchState({ USER: null, LOGGING_ERRORS: payload });
  }

  @Action(UserLogoutAction)
  UserLogoutAction({ patchState, dispatch }: StateContext<UserStateModel>) {
    dispatch(new TrackingStopWatchingAction());
    patchState({ USER: null, LOGGING_ERRORS: null });
    dispatch(new Navigate(['/login']));
  }

  @Action(UserRegisterAction)
  UserRegisterAction(
    { patchState, dispatch }: StateContext<UserStateModel>,
    { payload }: UserRegisterAction,
  ) {
    this.userService.register(payload).subscribe(
      user => {
        dispatch(new UserRegisterSuccessAction(user));
      },
      err => {
        dispatch(new UserRegisterFailAction(err.error));
      },
    );
  }

  @Action(UserRegisterSuccessAction)
  UserRegisterSuccessAction(
    { dispatch, patchState }: StateContext<UserStateModel>,
    { payload }: UserRegisterSuccessAction,
  ) {
    dispatch(new UserSaveAction(payload));
  }

  @Action(UserRegisterFailAction)
  UserRegisterFailAction(
    { patchState }: StateContext<UserStateModel>,
    { payload }: UserRegisterFailAction,
  ) {
    patchState({ USER: null, REGISTER_ERRORS: payload });
  }

  @Action(UserGetAllUsersAction)
  async UserGetAllUsersAction({ patchState }: StateContext<UserStateModel>) {
    try {
      const users = await this.databaseService.getUserRepository().find();
      patchState({ USERS: users });
    } catch (e) {}
  }

  @Action(UserConnectWithUserAction)
  async UserConnectWithUserAction(
    { patchState, dispatch }: StateContext<UserStateModel>,
    { payload }: UserConnectWithUserAction,
  ) {
    patchState({ USER: payload });
    dispatch(new Navigate(['/tracking']));
  }

  @Action(UserRemoveUserAction)
  async UserRemoveUserAction(
    { patchState, dispatch }: StateContext<UserStateModel>,
    { payload }: UserRemoveUserAction,
  ) {
    const repo = this.databaseService.getUserRepository();
    repo.delete(payload._id);
    dispatch(new UserGetAllUsersAction());
  }
}
