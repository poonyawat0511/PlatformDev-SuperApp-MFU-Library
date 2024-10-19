import { Room } from "./RoomTypes"
import { Timeslot } from "./TimeslotType"

export interface RoomTimeSlot{
    id?:string
    room:Room
    timeSlot:Timeslot
    status:"free"|"in use"|"reserved"
}