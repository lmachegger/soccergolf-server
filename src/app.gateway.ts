import { Logger } from '@nestjs/common';
import { WebSocketServer, WsResponse } from '@nestjs/websockets';
import { OnGatewayDisconnect } from '@nestjs/websockets';
import { OnGatewayConnection } from '@nestjs/websockets';
import { OnGatewayInit } from '@nestjs/websockets';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { GameData } from './game/game-data';
import { GameService } from './game/game-service';
import { ClientMessage, JoinRoomMessage } from './websocket-data';

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

  sendGameDatas(gameDatas: GameData[], room: string) {
    this.wss.to(room).emit('gameDataToClient', gameDatas);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, message: ClientMessage) {
    this.logger.log('msgToServer: ' + message);
    this.wss.to(message.room).emit('msgToClient', message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, message: JoinRoomMessage) {
    this.logger.log(
      'joinRoom: player=' + message.player + ' room=' + message.room,
    );

    // join room
    client.join(message.room);
    client.emit('joinedRoom', message.room);

    // add player to game
    this.gameService.addPlayerToGame(message.player, message.room);

    // send new gamedata to all players
    this.sendGameDatas(this.gameService.gameDatas, message.room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    this.logger.log('leftRoom: clientId=' + client.id + ' room=' + room);
    client.leave(room);
    client.emit('leftRoom', room);
  }
}
