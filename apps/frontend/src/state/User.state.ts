import User from '../domain/entities/User.light';
import { injectable } from 'inversify';
import { action, makeObservable, observable } from 'mobx';

@injectable()
export class UserState {
  @observable isAuthorized = false;
  @observable authToken = '';
  @observable User: User | null = null;

  @action
  setAuthToken(token: string) {
    this.authToken = token;
    this.isAuthorized = true;
  }
  @action
  clearAuthToken() {
    this.authToken = '';
    this.isAuthorized = false;
  }
  @action setUser(user: User) {
    this.User = user;
  }

  @action clearUserData() {
    this.User = null;
  }
  constructor() {
    makeObservable(this);
  }
}
