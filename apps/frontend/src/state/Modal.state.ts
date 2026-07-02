import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export default class ModalState {
  private activeModals: Record<string, boolean> = {};

  constructor() {
    makeAutoObservable(this); 
  }

  isActive(modalName: string): boolean {
    return !!this.activeModals[modalName];
  }

  active(modalName: string) {
    this.activeModals[modalName] = true;
  }

  unactive(modalName: string) {
    this.activeModals[modalName] = false;
  }
}