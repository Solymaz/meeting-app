import { TAttendee } from "./attendee";
import { TTimeFormat } from "./times";

export type TMeetingData = {
  attendees: TAttendee[];
  date: string;
  description: string;
  endTime: TTimeFormat;
  name: string;
  startTime: TTimeFormat;
  _id: string;
};
