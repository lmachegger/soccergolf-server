import { Logger } from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import { OnGatewayDisconnect } from '@nestjs/websockets';
import { OnGatewayConnection } from '@nestjs/websockets';
import { OnGatewayInit } from '@nestjs/websockets';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): WsResponse<string> {
    this.logger.log('msgToServer: ' + text);
    return { event: 'msgToClient', data: text };
  }
}
