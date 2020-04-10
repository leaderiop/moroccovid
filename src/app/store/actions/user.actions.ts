import { UserLoginPayload } from '../payloads/user-login.payload';
import { UserModel } from '../models/user.model';
import { UserRegisterPayload } from '../payloads/user-register.payload';
import { ErrorResponseModel } from '../models/error/error-response.model';
export class UserLoginAction {
  static readonly type = '[User] Login';
  constructor(public readonly payload: UserLoginPayload) {}
}

export class UserLoginSuccessAction {
  static readonly type = '[User] Login Success';
  constructor(public readonly payload: UserModel) {}
}

export class UserSaveAction {
  static readonly type = '[User] Save';
  constructor(public readonly payload: UserModel) {}
}

export class UserLoginFailAction {
  static readonly type = '[User] Login Fail';
  constructor(public readonly payload: ErrorResponseModel) {}
}

export class UserLogoutAction {
  static readonly type = '[User] Logout';
  constructor() {}
}

export class UserRegisterAction {
  static readonly type = '[User] Register';
  constructor(public readonly payload: UserRegisterPayload) {}
}

export class UserRegisterSuccessAction {
  static readonly type = '[User] Register Success';
  constructor(public readonly payload: UserModel) {}
}

export class UserRegisterFailAction {
  static readonly type = '[User] Register Fail';
  constructor(public readonly payload: ErrorResponseModel) {}
}

export class UserGetAllUsersAction {
  static readonly type = '[User] Get All Users';
  constructor() {}
}

export class UserConnectWithUserAction {
  static readonly type = '[User] Connect With User';
  constructor(public readonly payload: UserModel) {}
}

export class UserRemoveUserAction {
  static readonly type = '[User] Remove User';
  constructor(public readonly payload: UserModel) {}
}
