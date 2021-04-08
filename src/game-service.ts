import { Logger } from '@nestjs/common';
import { createInitialPlayerPoints } from './gamedata-utils';
import { GameData } from './websocket-data';

export class GameService {
  private gameDatas: GameData[] = [];
  private logger: Logger = new Logger('GameService');

  constructor() {}

  public addPlayerToGame(player: string, room: string) {
    let gameData = this.gameDatas.find((gd) => gd.room === room);
    // if room already exists
    if (gameData) {
      // if player already exists
      if (gameData.playerScores.find((ps) => ps.player === player)) {
        this.logger.error(
          `Player '${player}' already exists in room '${room}'`,
        );
        return;
      }

      // add player
      this.addPlayerToRoom(player, room);
    } else {
      // if room doesn't exist, create it!
      this.gameDatas.push({
        room: room,
        playerScores: [],
      });

      // add player
      this.addPlayerToRoom(player, room);
    }
  }

  private addPlayerToRoom(player: string, room: string) {
    const gameData = this.gameDatas.find((gd) => gd.room === room);
    if (!gameData) {
      this.logger.error(`Room '${room}' not found!`);
      return;
    }

    gameData.playerScores.push({
      player: player,
      points: createInitialPlayerPoints(),
    });
  }
}
