import container, { TYPES } from '@/infrastructure/Container';
import { makeObservable, observable, action } from 'mobx';
import { env } from 'next-runtime-env';
import { io, Socket } from 'socket.io-client';
import { UserState } from './User.state';

export class SocketState {
  @observable socket: Socket | null = null;

  constructor() {
    makeObservable(this);

    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  @action
  private connect() {
    const userState = container.get<UserState>(TYPES.UserState);
    const wsUrl = env('NEXT_PUBLIC_WEBSOKET_URL') || '';

    this.socket = io(wsUrl, {
      path: '/ws',
      auth: {
        token: userState.authToken,
      },
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket успішно підключено з ID:', this.socket?.id);
    });

    this.socket.on('connect_error', (err) => {
      console.error('❌ Помилка підключення до сокету:', err.message);
    });
  }

  @action
  public reconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.connect();
  }
}
