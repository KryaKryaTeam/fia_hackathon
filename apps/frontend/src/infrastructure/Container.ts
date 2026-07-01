import { Container } from 'inversify';
import { UserState } from '../state/User.state';
import { TYPES } from './Container.types';
import GetGeoDataLocalRequest from '@/request/GetGeoDataLocal.request';

const container: Container = new Container();

// --- SINGLETONS (Using Constant Value for absolute safety) ---
container.bind(TYPES.UserState).to(UserState).inSingletonScope();
container.bind(TYPES.GetGeoData).to(GetGeoDataLocalRequest).inRequestScope();
export default container;
export { TYPES };
