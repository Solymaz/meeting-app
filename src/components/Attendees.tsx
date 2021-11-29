import React, { ReactNode } from "react";
import { TAttendee } from "../types/attendee";

type TProps = {
  attendees: TAttendee[];
  children: ReactNode;
  keyId: string;
};

export default function Attendees({ attendees, children, keyId }: TProps) {
  const { length } = attendees;
  return (
    <p>
      <strong> {children}</strong>
      {attendees.map((attendee, index) => (
        <span key={keyId + attendee.userId}>
          {attendee.email}
          {index < length - 1 && ", "}
        </span>
      ))}
    </p>
  );
}
