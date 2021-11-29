import React, { useContext, useState } from "react";
import { Button, Card, Col, Form } from "react-bootstrap";
import makeAnimated from "react-select/animated";
import { AuthContext } from "../contexts/authContext";
import { addMember } from "../services/teams";
import { TAttendee } from "../types/attendee";
import { TMeetingUser } from "../types/meetingUser";
import { TOptionType } from "../types/option";
import Attendees from "./Attendees";
import StyledButton from "./Button";
import StyledCard from "./Card";
import StyledErrorText from "./Error";
import StyledSelect from "./Select";

type TTeamCardProp = {
  teamId: string;
  name: string;
  shortName: string;
  description: string;
  members: TAttendee[];
  excuseYourself: (teamId: string) => void;
  users: TMeetingUser[];
  usersFetchErrMsg: string;
};

const animatedComponents = makeAnimated();

const TeamCard = ({
  name,
  description,
  members: membersProp,
  shortName,
  teamId,
  excuseYourself,
  users,
  usersFetchErrMsg,
}: TTeamCardProp) => {
  const [addMemberErrorMsg, setAddMemberErrorMsg] = useState("");
  const { user } = useContext(AuthContext);
  const { token } = user;
  const [members, setMembers] = useState(membersProp);
  const [selected, setSelected] = useState<TOptionType>();
  const [memberOption, setMemberOption] = useState<TAttendee>();

  const membersOptions = users.map(({ email, _id }) => ({
    value: _id,
    label: email,
  }));

  async function handleAddMember(id: string, currentMembers: TAttendee[]) {
    if (memberOption) {
      const result = await addMember(id, memberOption, currentMembers, token);

      if (result.data) {
        setMembers(result.data);
        setSelected(undefined);
        setMemberOption(undefined);
        setAddMemberErrorMsg("");
      } else {
        setAddMemberErrorMsg(result.error);
      }
    } else {
      setAddMemberErrorMsg("Please select a member!");
    }
  }

  return (
    <Col lg="4" sm="12" md="6" className="mb-3">
      <StyledCard>
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>@{shortName}</Card.Text>
          <Card.Text>{description}</Card.Text>
          <Button variant="danger" onClick={() => excuseYourself(teamId)}>
            Excuse yourself{" "}
          </Button>
          <hr />
          <Attendees attendees={members} keyId={teamId}>
            Members:{" "}
          </Attendees>
          <Form.Group className="mt-1" controlId="select">
            <Form.Label visuallyHidden>Select a member</Form.Label>
            <StyledSelect
              inputId="select"
              name="select"
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
                setSelected(option as TOptionType);
              }}
            />
            {usersFetchErrMsg.length > 0 && (
              <StyledErrorText>{usersFetchErrMsg}</StyledErrorText>
            )}
            <StyledButton
              variant="primary"
              onClick={() => handleAddMember(teamId, members)}
            >
              Add
            </StyledButton>
            {addMemberErrorMsg.length > 0 && (
              <StyledErrorText>{addMemberErrorMsg}</StyledErrorText>
            )}
          </Form.Group>
        </Card.Body>
      </StyledCard>
    </Col>
  );
};

export default TeamCard;
