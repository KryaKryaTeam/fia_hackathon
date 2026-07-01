import { Container } from 'inversify';
import { UserState } from '../state/User.state';
import { TYPES } from './Container.types';

const container: Container = new Container();

// --- SINGLETONS (Using Constant Value for absolute safety) ---
container.bind(TYPES.UserState).to(UserState).inSingletonScope();

export default container;
export { TYPES };
