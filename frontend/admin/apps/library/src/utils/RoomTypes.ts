import { RoomType } from "./RoomtypeTypes";

export interface Room {
  id: string;
  room: number;
  floor: number;
  status: string;
  type: RoomType;
}


