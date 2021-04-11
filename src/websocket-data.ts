export interface ClientMessage {
  sender: string;
  room: string;
  message: string;
}

export interface JoinRoomMessage {
  player: string;
  room: string;
}
