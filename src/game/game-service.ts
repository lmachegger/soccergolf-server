import { Logger } from '@nestjs/common';
import { GameData } from './game-data';
import { createInitialPlayerPoints } from './gamedata-utils';

export class GameService {
  private _gameDatas: GameData[] = [];
  public get gameDatas(): GameData[] {
    return this._gameDatas;
  }

  private logger: Logger = new Logger('GameService');

  constructor() {}

  public addPlayerToGame(player: string, room: string) {
    let gameData = this._gameDatas.find((gd) => gd.room === room);
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
      this._gameDatas.push({
        room: room,
        playerScores: [],
      });

      // add player
      this.addPlayerToRoom(player, room);
    }
  }

  private addPlayerToRoom(player: string, room: string) {
    const gameData = this._gameDatas.find((gd) => gd.room === room);
    if (!gameData) {
      this.logger.error(`Room '${room}' not found!`);
      return;
    }

    const newPlayer = {
      player: player,
      points: createInitialPlayerPoints(),
    };
    gameData.playerScores.push(newPlayer);

    this.logger.log('added new player: ' + newPlayer);
  }
}
