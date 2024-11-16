export interface Reservations {
    id: string;
    room: { id: string; room: number };
    timeSlot: { id: string; start: string; end: string };
    type: string;
    dateTime: string;
    user: { id: string; username: string };
  }