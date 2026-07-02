import { Container } from 'inversify';
import { UserState } from '../state/User.state';
import { TYPES } from './Container.types';
import GetGeoDataLocalRequest from '@/request/GetGeoDataLocal.request';
import ChangeStreetLocalRequest from '@/request/ChangeStreetLocal.request'; // <-- Додано імпорт
import ModalState from '@/state/Modal.state';
import StreetDataState from '@/state/StreetData.state';
import { RequestLoginWithGoogle } from '../request/LoginWithGoogle.request';

const container: Container = new Container();

// --- SINGLETONS (Using Constant Value for absolute safety) ---
container.bind(TYPES.UserState).to(UserState).inSingletonScope();
container.bind(TYPES.ModalState).to(ModalState).inSingletonScope();
container.bind(TYPES.StreetState).to(StreetDataState).inSingletonScope();

// --- REQUESTS (In Request Scope) ---
container.bind(TYPES.GetGeoData).to(GetGeoDataLocalRequest).inRequestScope();
container
  .bind(TYPES.ChangeStreetRequest)
  .to(ChangeStreetLocalRequest)
  .inRequestScope(); // <-- Додано реєстрацію

container.bind(RequestLoginWithGoogle).toSelf().inRequestScope();
export default container;
export { TYPES };
