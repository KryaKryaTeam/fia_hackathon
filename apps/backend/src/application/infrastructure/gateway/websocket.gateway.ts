import { AuthGuard } from '@/authorization/infrastructure/guards/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  path: '/ws',
  namespace: 'application',
  cors: { origin: '*' },
  pingTimeout: 20000,
  pingInterval: 25000,
})
export class ApplicationSoket {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_application_room')
  @UseGuards(AuthGuard)
  handleRoomJoin(client: Socket, data: { applicationId: string }) {
    client.join(`app_${data.applicationId}`);
  }

  sendToSpecificRoom(applicationId: string, pdf_url: string) {
    this.server.to(`app_${applicationId}`).emit('status_updated', { pdf_url });
  }
}
