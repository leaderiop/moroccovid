import { Injectable } from '@angular/core';
import { UserLoginPayload } from '../payloads/user-login.payload';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { UserRegisterPayload } from '../payloads/user-register.payload';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private server: string =
    'https://covid-19-morocco-tracker.herokuapp.com/user/';
  constructor(private readonly httpClient: HttpClient) {}

  login(payload: UserLoginPayload) {
    return this.httpClient.post<UserModel>(this.server + 'login', payload);
  }

  register(payload: UserRegisterPayload) {
    return this.httpClient.post<UserModel>(this.server + 'register', payload);
  }
}
