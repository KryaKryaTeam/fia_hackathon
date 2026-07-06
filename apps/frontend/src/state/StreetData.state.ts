import { injectable } from 'inversify';
import { action, observable, makeAutoObservable } from 'mobx';

@injectable()
export default class StreetDataState {
  @observable
  private _street = '';

  constructor() {
    makeAutoObservable(this);
  }
  @action
  set street(data: string) {
    this._street = data;
  }

  get street(): string {
    return this._street;
  }
}
