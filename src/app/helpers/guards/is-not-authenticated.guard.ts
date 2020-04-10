import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';

@Injectable({
  providedIn: 'root',
})
export class IsNotAutneticatedGuard implements CanActivate {
  private user = null;
  constructor(private readonly store: Store) {
    this.store
      .select(state => state.user.USER)
      .subscribe(user => {
        this.user = user;
      });
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    if (this.user) this.store.dispatch(new Navigate(['/tracking']));
    return !this.user;
  }
}
