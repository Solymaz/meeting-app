import React, { useContext, useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import styled from "styled-components";
import makeAnimated from "react-select/animated";
import { format, parseISO } from "date-fns";
import { TMeetingData } from "../types/meeting";
import { AuthContext } from "../contexts/authContext";
import Attendees from "./Attendees";
import { TOptionType } from "../types/option";
import { TAttendee } from "../types/attendee";
import StyledSelect from "./Select";
import StyledAlert from "./Alert";
import StyledButton from "./Button";
import { TMeetingUser } from "../types/meetingUser";
import { addAttendee } from "../services/meetings";

const StyledMeetingTime = styled.span`
  font-size: 16px;
`;

const animatedComponents = makeAnimated();

type TProps = {
  searchResultData: TMeetingData;
  error: string;
  users: TMeetingUser[];
  excuseYourself: (meetingId: string) => void;
};

const MeetingCard = ({
  searchResultData,
  error,
  users,
  excuseYourself,
}: TProps) => {
  const {
    attendees: attendeesProp,
    endTime,
    name: title,
    startTime,
    _id: Id,
    date,
  } = searchResultData;
  const { user } = useContext(AuthContext);
  const { token } = user;
  const [memberOption, setMemberOption] = useState<TAttendee>();
  const [meetingId, setMeetingId] = useState("");
  const [attendees, setAttendees] = useState<TAttendee[]>(attendeesProp);
  const membersOptions = users.map(({ email, _id }) => ({
    value: _id,
    label: email,
  }));
  const [selected, setSelected] = useState<TOptionType>();
  const [addMemberErrMsg, setAddMemberErrMsg] = useState("");
  const [showAddMemberErrMsg, setShowAddMemberErrMsg] = useState(false);

  const handleAddMember = async () => {
    if (memberOption) {
      const result = await addAttendee(
        meetingId,
        attendees,
        memberOption,
        token
      );
      if (result.data) {
        setAttendees(result.data);
        setSelected(undefined);
        setShowAddMemberErrMsg(false);
      } else {
        setAddMemberErrMsg(result.error);
        setShowAddMemberErrMsg(true);
      }
    } else {
      setAddMemberErrMsg("Please select an attendee!");
      setShowAddMemberErrMsg(true);
    }
  };

  const formatedDate = format(parseISO(date), "dd MMMM yyyy");

  return (
    <>
      <hr />
      <Card>
        <Card.Body>
          <Card.Title>
            {formatedDate}{" "}
            <StyledMeetingTime>
              {startTime.hours < 10
                ? `0${startTime.hours}`
                : `${startTime.hours}`}
              :
              {startTime.minutes < 10
                ? `0${startTime.minutes}`
                : `${startTime.minutes}`}{" "}
              - {endTime.hours < 10 ? `0${endTime.hours}` : `${endTime.hours}`}:
              {endTime.minutes < 10
                ? `0${endTime.minutes}`
                : `${endTime.minutes}`}
            </StyledMeetingTime>
          </Card.Title>
          <Card.Text>{title}</Card.Text>
          <Button variant="danger" onClick={() => excuseYourself(Id)}>
            Excuse yourself{" "}
          </Button>
          <hr />
          <Attendees attendees={attendees} keyId={meetingId}>
            Attendees:{" "}
          </Attendees>
          <Form.Group className="mt-1">
            <StyledSelect
              closeMenuOnSelect
              components={animatedComponents}
              placeholder="Select member"
              options={membersOptions}
              value={[selected]}
              onChange={(option) => {
                const { value, label } = option as TOptionType;
                setMemberOption({
                  email: label,
                  userId: value,
                });
                setMeetingId(Id);
                setSelected(option as TOptionType);
              }}
            />
            {error.length > 0 && (
              <StyledAlert variant="danger">{error}</StyledAlert>
            )}
            <StyledButton variant="primary" onClick={handleAddMember}>
              Add
            </StyledButton>
            {showAddMemberErrMsg && (
              <StyledAlert variant="danger">{addMemberErrMsg}</StyledAlert>
            )}
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
};

export default MeetingCard;
