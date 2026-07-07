import container from '@/infrastructure/Container';
import { TYPES } from '@/infrastructure/Container.types';
import { LocalRequest } from '@/infrastructure/LocalRequest';
import StreetDataState from '@/state/StreetData.state';
import { TicketState } from '@/state/Ticket.state';
import { UserState } from '@/state/User.state';
import { inject, injectable } from 'inversify';

@injectable()
export default class ChangeStreetLocalRequest extends LocalRequest<
  string,
  void,
  string
> {
  mockOutputData = 'Mocked Street Name';

  constructor(
    @inject(TYPES.UserState) protected override readonly userState: UserState,
    @inject(TYPES.StreetState) private readonly streetState: StreetDataState,
  ) {
    super(userState);
  }

  async mapData(data: string): Promise<string> {
    return data;
  }

  async onSuccess(data: string): Promise<void> {
    container.get<TicketState>(TicketState).chooseAddress(data);
  }
}
