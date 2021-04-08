import { Logger } from '@nestjs/common';
import { WebSocketServer, WsResponse } from '@nestjs/websockets';
import { OnGatewayDisconnect } from '@nestjs/websockets';
import { OnGatewayConnection } from '@nestjs/websockets';
import { OnGatewayInit } from '@nestjs/websockets';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { GameService } from './game/game-service';
import { ClientMessage } from './websocket-data';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('AppGateway');

  private gameService: GameService;

  @WebSocketServer()
  wss: Server;

  afterInit(server: Server) {
    this.gameService = new GameService();
    this.logger.log('Initialized!');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, message: ClientMessage) {
    this.logger.log('msgToServer: ' + message);
    this.wss.to(message.room).emit('msgToClient', message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    this.logger.log('joinRoom: clientId=' + client.id + ' room=' + room);
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    this.logger.log('leftRoom: clientId=' + client.id + ' room=' + room);
    client.leave(room);
    client.emit('leftRoom', room);
  }
}
