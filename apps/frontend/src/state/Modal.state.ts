import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
type ModalName = 'Geo' | 'InputStreet' | 'ticket'; // Add other modal names as needed
@injectable()
export default class ModalState {
  private activeModals: Record<ModalName, boolean> = {} as Record<
    ModalName,
    boolean
  >;

  constructor() {
    makeAutoObservable(this);
  }

  isActive(modalName: ModalName): boolean {
    return !!this.activeModals[modalName];
  }

  active(modalName: ModalName) {
    this.activeModals[modalName] = true;
  }

  unactive(modalName: ModalName) {
    this.activeModals[modalName] = false;
  }
}
