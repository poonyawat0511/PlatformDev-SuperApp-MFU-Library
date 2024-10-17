import { Room } from "./RoomTypes"
import { Timeslot } from "./TimeslotType"
import { User } from "./UserTypes"

export interface Reservation{
    id?: string;
    room:Room
    user:User
    type:"pending"|"confirmed"|"cancelled",
    timeSlot:Timeslot
    dateTime:string
}