import { injectable, unmanaged } from "inversify";
import { makeAutoObservable, observable } from "mobx";

export type Modals = "Geo";

@injectable()
export default class ModalState {
  modals: Map<Modals, boolean>;

  constructor(@unmanaged() modals: Map<Modals, boolean> = new Map()) {
    this.modals = observable.map(modals);
    makeAutoObservable(this);
  }

  isActive(name: Modals): boolean {
    return this.modals.get(name) ?? false;
  }

  active(name: Modals) {
    this.modals.set(name, true);
  }

  unactive(name: Modals) {
    this.modals.set(name, false);
  }

  toggle(name: Modals) {
    this.modals.set(name, !this.isActive(name));
  }
}