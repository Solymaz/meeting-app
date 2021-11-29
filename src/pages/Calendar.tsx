import React, { useContext, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import styled from "styled-components";
import { Alert, Form, OverlayTrigger, Popover } from "react-bootstrap";
import { AuthContext } from "../contexts/authContext";
import { TMeetingData } from "../types/meeting";
import { TTimeFormat } from "../types/times";
import Attendees from "../components/Attendees";
import colors from "../styles/color";
import viewCalendar from "../services/calendar";
import StyledMessage from "../components/Message";

interface ITime {
  time: {
    startTime: TTimeFormat;
    endTime: TTimeFormat;
  };
}

const hourColHeight = 60;
const gap = 10;

const StyledDay = styled.h5`
  color: ${colors.GRAY};
  margin-bottom: 10px;
`;

const StyledCol = styled.div`
  margin-bottom: ${gap}px;
`;

const StyledColNumber = styled.span`
  float: left;
  margin: -5px -20px;
`;
const StyledColBackground = styled.div`
  background-color: ${colors.TEAL};
  height: ${hourColHeight}px;
`;
const StyledContainer = styled.div`
  position: relative;
  @media (max-width: 768px) {
    position: relative;
    margin: 10px;
  }
`;

// :-)
const StyledOverlay = styled.div<ITime>`
  background-color: rgba(214, 239, 242, 0.9);
  border: solid 2px;
  border-color: lightgray;
  height: ${({ time: { startTime, endTime } }) => {
    const startTimeInMinute = startTime.hours * 60 + startTime.minutes;
    const endTimeInMinute = endTime.hours * 60 + endTime.minutes;
    const duration = endTimeInMinute - startTimeInMinute;
    const margin = Math.floor(duration / 61) * gap;
    const scale = hourColHeight / 60; // how many px is one minute
    return duration * scale + margin;
  }}px;
  padding: 5px;
  left: 0.5%;
  overflow: auto;
  position: absolute;
  top: ${({ time: { startTime } }) => {
    const startTimeInMinute = startTime.hours * 60 + startTime.minutes;
    const margin = Math.floor(startTimeInMinute / 60) * gap;
    const scale = hourColHeight / 60;
    return startTimeInMinute * scale + margin;
  }}px;
  width: 99%;
  z-index: 2;
`;

const StyledHr = styled.hr`
  margin: 5px 0;
`;

const StyledH1 = styled.h1`
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const StyledDate = styled.input`
  @media (max-width: 768px) {
    width: 150px;
    height: fit-content;
  }
`;
const StyledSpan = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

export default function Calendar() {
  const [pickedDate, setPickedDate] = useState<Date>(new Date());
  const [calendarErrorMsg, setCalendarErrorMsg] = useState();
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [meetingsData, setMeetingsData] = useState<TMeetingData[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const hours = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 24; i++) {
    hours[i] = i;
  }
  const formatedDate = format(pickedDate, "dd MMMM yyyy");
  const dateValue = format(pickedDate, "yyyy-MM-dd");
  const day = format(pickedDate, "EEEE");

  const { user } = useContext(AuthContext);
  const { token } = user;

  useEffect(() => {
    async function fetch() {
      setCalendarLoading(true);
      setShowErrorMsg(false);
      const result = await viewCalendar(dateValue, token);
      if (result.data) {
        setMeetingsData(result.data);
        setCalendarLoading(false);
        setShowErrorMsg(false);
      } else {
        setCalendarLoading(false);
        setCalendarErrorMsg(result.error);
        setShowErrorMsg(true);
      }
    }
    fetch();
  }, [pickedDate, token]);

  return (
    <>
      <StyledH1>Calendar</StyledH1>
      <hr />
      <section className="d-flex justify-content-between">
        <h4>{formatedDate}</h4>
        {calendarLoading && (
          <StyledMessage>
            <StyledSpan> Calendar is loading </StyledSpan>
            <span
              className="spinner-border spinner-border-sm text-secondary"
              role="status"
            />
          </StyledMessage>
        )}
        {!showErrorMsg && !calendarLoading && meetingsData.length === 0 && (
          <StyledMessage>
            <StyledSpan>You have no meetings! 😉</StyledSpan>
          </StyledMessage>
        )}
        {showErrorMsg && <Alert variant="danger">{calendarErrorMsg}</Alert>}
        <Form.Label visuallyHidden className="float-end" htmlFor="date">
          Date
        </Form.Label>
        <StyledDate
          id="date"
          type="date"
          value={dateValue}
          onChange={(e) => {
            const newDate = parseISO(e.target.value);
            setPickedDate(newDate);
          }}
        />
      </section>
      <StyledDay>{day}</StyledDay>
      <StyledContainer>
        {hours.map((hour) => (
          <StyledCol key={hour}>
            <StyledColNumber>{hour}</StyledColNumber>
            <StyledColBackground />
          </StyledCol>
        ))}
        {meetingsData.map(
          ({
            attendees,
            endTime,
            name: title,
            startTime,
            description,
            _id: meetingId,
          }) => (
            <StyledOverlay time={{ startTime, endTime }} key={meetingId}>
              <OverlayTrigger
                trigger={["hover", "focus"]}
                placement="right"
                overlay={
                  <Popover id="meeting description">
                    <Popover.Header as="h3">Meeting description</Popover.Header>
                    <Popover.Body>{description}</Popover.Body>
                  </Popover>
                }
              >
                <strong>{title}</strong>
              </OverlayTrigger>
              <StyledHr />
              <Attendees attendees={attendees} keyId={meetingId}>
                Attendees:{" "}
              </Attendees>
            </StyledOverlay>
          )
        )}
      </StyledContainer>
    </>
  );
}
