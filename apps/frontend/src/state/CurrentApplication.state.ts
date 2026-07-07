import { makeObservable, observable, action, computed } from 'mobx';
import type { CreateApplicationResponse } from '@/request/CreateApplication.request';
import { injectable } from 'inversify';

type ApplicationData = CreateApplicationResponse['application'];

@injectable()
export class CurrentApplicationState {
  @observable currentApplication: ApplicationData | null = null;

  constructor() {
    makeObservable(this);
  }

  @action
  public setCurrentApplication(response: CreateApplicationResponse): void {
    this.currentApplication = response.application;
  }

  @action
  public clearCurrentApplication(): void {
    this.currentApplication = null;
  }

  @computed
  public get isHereCurrent(): boolean {
    return this.currentApplication !== null;
  }
}
