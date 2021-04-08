export interface GameData {
  room: string;
  playerScores: PlayerScore[];
}

export interface PlayerScore {
  player: string;
  points: Points[];
}

export interface Points {
  name: string;
  score: number;
}
