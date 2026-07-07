import { Container } from 'inversify';
import { UserState } from '../state/User.state';
import { TYPES } from './Container.types';
import GetGeoDataLocalRequest from '@/request/GetGeoDataLocal.request';
import ChangeStreetLocalRequest from '@/request/ChangeStreetLocal.request'; // <-- Додано імпорт
import ModalState from '@/state/Modal.state';
import StreetDataState from '@/state/StreetData.state';
import { RequestLoginWithGoogle } from '../request/LoginWithGoogle.request';
import { QueryClient } from '@tanstack/react-query';
import { MyUserRequest } from '@/request/MyUser.request';
import { UpdateMyDataRequest } from '@/request/UpdateMyData.request';
import { TicketState } from '@/state/Ticket.state';
import { CurrentApplicationState } from '@/state/CurrentApplication.state';
import { CreateApplicationRequest } from '@/request/CreateApplication.request';
import { SocketState } from '@/state/Soket.state';
const queryClient = new QueryClient();
const container: Container = new Container();

// --- SINGLETONS (Using Constant Value for absolute safety) ---
container.bind(TYPES.UserState).to(UserState).inSingletonScope();
container.bind(TYPES.ModalState).to(ModalState).inSingletonScope();
container.bind(TYPES.StreetState).to(StreetDataState).inSingletonScope();
container.bind(TicketState).toSelf().inSingletonScope();
container.bind(CurrentApplicationState).toSelf().inSingletonScope();
container.bind(SocketState).toSelf().inSingletonScope();

// --- REQUESTS (In Request Scope) ---
container.bind(TYPES.GetGeoData).to(GetGeoDataLocalRequest).inRequestScope();
container
  .bind(TYPES.ChangeStreetRequest)
  .to(ChangeStreetLocalRequest)
  .inRequestScope();

container.bind(TYPES.QUERY_CLIENT).toConstantValue(queryClient);
container.bind(RequestLoginWithGoogle).toSelf().inRequestScope();
container.bind(MyUserRequest).toSelf().inRequestScope();
container.bind(UpdateMyDataRequest).toSelf().inRequestScope();
container.bind(CreateApplicationRequest).toSelf().inRequestScope();
export default container;
export { TYPES };
