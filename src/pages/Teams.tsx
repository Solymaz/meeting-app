/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useContext, useCallback } from "react";
import { Card, Col, Form, Row, Alert } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import makeAnimated from "react-select/animated";
import { useForm } from "react-hook-form";
import {
  viewTeams,
  excuseYourself,
  TAddTeamInput,
  addTeam,
} from "../services/teams";
import allUsers from "../services/user";
import { TAttendee } from "../types/attendee";
import { TMeetingUser } from "../types/meetingUser";
import { AuthContext } from "../contexts/authContext";
import TeamCard from "../components/TeamCard";
import Attendees from "../components/Attendees";
import StyledSelect from "../components/Select";
import { TOptionType } from "../types/option";
import StyledButton from "../components/Button";
import StyledTextarea from "../components/Textarea";
import StyledCard from "../components/Card";
import StyledErrorText from "../components/Error";
import StyledFormControl from "../components/FormControl";
import "react-toastify/dist/ReactToastify.css";
import StyledMessage from "../components/Message";

export type TTeamData = {
  _id: string;
  name: string;
  shortName: string;
  description: string;
  members: TAttendee[];
};

const animatedComponents = makeAnimated();

export default function Teams() {
  const [teamsData, setTeamsData] = useState<TTeamData[]>([]);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<TMeetingUser[]>([]);
  const [newTeamMembers, setNewTeamMemebers] = useState<TAttendee[]>([]);
  const [memberOption, setMemberOption] = useState<TAttendee>();
  const [loading, setLoading] = useState(true);
  const [usersFetchErrMsg, setUsersFetchErrMsg] = useState<string>("");
  const [selected, setSelected] = useState<TOptionType>();
  const [addMemberErrMsg, setAddMemberErrMsg] = useState("");
  const [addTeamErrMsg, setAddTeamErrMsg] = useState("");
  const [showAddTeamCard, setShowAddTeamCard] = useState(false);
  const { user } = useContext(AuthContext);
  const { token } = user;

  const membersOptions = users.map(({ email, _id }) => ({
    value: _id,
    label: email,
  }));

  useEffect(() => {
    const getTeams = async () => {
      const result = await viewTeams(token);
      if (result.data) {
        setTeamsData(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };
    getTeams();
  }, []);

  useEffect(() => {
    async function getUsers() {
      const result = await allUsers(token);

      if (result.data) {
        setUsers(result.data);
      } else {
        setUsersFetchErrMsg(result.error);
      }
    }
    getUsers();
  }, []);

  const handleExcuseYourself = async (id: string) => {
    const result = await excuseYourself(id, teamsData, token);
    if (result.data) {
      setTeamsData(result.data);
      toast.success("You successfully excused yourself! 😉");
    } else {
      toast.error(result.error);
    }
  };

  const handleAddMember = () => {
    if (memberOption) {
      setNewTeamMemebers([...newTeamMembers, memberOption]);
      setSelected(undefined);
      setAddMemberErrMsg("");
    } else {
      setAddMemberErrMsg("Please select a member!");
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<TAddTeamInput>();

  const memoizedHandleSubmit = useCallback(
    handleSubmit(async (formData) => {
      const result = await addTeam(formData, newTeamMembers, token);
      if (result.data) {
        setTeamsData([...teamsData, result.data]);
        setAddMemberErrMsg("");
        reset();
        setNewTeamMemebers([]);
        setSelected(undefined);
        setMemberOption(undefined);
        setShowAddTeamCard(false);
        setAddTeamErrMsg("");
        toast.success("A new team added! 👏");
      } else {
        setAddTeamErrMsg(result.error);
      }
    }),
    [teamsData, newTeamMembers]
  );

  useEffect(() => {
    const subscription = watch(() => {
      setAddTeamErrMsg("");
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <>
      <h1>Teams</h1>
      <hr />
      <Row className="mb-3 d-flex align-items-stretch">
        {loading && (
          <StyledMessage>
            <span> Teams are loading </span>
            <span
              className="spinner-border spinner-border-sm text-secondary"
              role="status"
            />
          </StyledMessage>
        )}
        <Col lg="4" sm="12" md="6" className="mb-3">
          {!loading &&
            (!showAddTeamCard ? (
              <StyledCard
                className="d-flex justify-content-center align-items-center fs-1"
                onClick={() => setShowAddTeamCard(!showAddTeamCard)}
              >
                +
              </StyledCard>
            ) : (
              <StyledCard className="mb-4 ">
                <Card.Body>
                  <Form onSubmit={memoizedHandleSubmit}>
                    <Form.Group className="mt-1" controlId="name">
                      <Form.Label visuallyHidden>Team name</Form.Label>
                      <StyledFormControl
                        type="text"
                        placeholder="Team name"
                        isInvalid={!!errors.name}
                        {...register("name", { required: true })}
                      />
                      {!!errors.name && (
                        <Form.Control.Feedback type="invalid" role="alert">
                          Name is required!
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <Form.Group className="mt-1" controlId="shortName">
                      <Form.Label visuallyHidden>Team short name</Form.Label>
                      <StyledFormControl
                        type="text"
                        placeholder="Team short name"
                        isInvalid={!!errors.shortName}
                        {...register("shortName", { required: true })}
                      />
                      {!!errors.shortName && (
                        <Form.Control.Feedback type="invalid" role="alert">
                          Short name is required!
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <Form.Group className="mt-1" controlId="description">
                      <Form.Label visuallyHidden>Description</Form.Label>
                      <StyledTextarea
                        id="description"
                        cols={10}
                        rows={2}
                        isInvalid={!!errors.description}
                        placeholder="Provide a description for the team"
                        {...register("description", { required: true })}
                      />
                      {!!errors.description && (
                        <StyledErrorText role="alert">
                          Description is required!
                        </StyledErrorText>
                      )}
                    </Form.Group>
                    <hr />
                    <Attendees attendees={newTeamMembers} keyId="newTeam">
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
                        <StyledErrorText role="alert">
                          {usersFetchErrMsg}
                        </StyledErrorText>
                      )}
                      <StyledButton
                        data-testid="addMemberButton"
                        variant="primary"
                        onClick={handleAddMember}
                      >
                        Add
                      </StyledButton>
                      {addMemberErrMsg.length > 0 && (
                        <StyledErrorText>{addMemberErrMsg}</StyledErrorText>
                      )}
                    </Form.Group>
                    <StyledButton
                      variant="primary"
                      type="submit"
                      className="mt-2 w-100"
                    >
                      Add Team
                    </StyledButton>
                    {addTeamErrMsg.length > 0 && (
                      <Alert variant="danger" className="mt-3">
                        {addTeamErrMsg}
                      </Alert>
                    )}
                  </Form>
                </Card.Body>
              </StyledCard>
            ))}
        </Col>
        {teamsData.map(({ name, description, members, shortName, _id }) => (
          <TeamCard
            key={_id}
            name={name}
            description={description}
            members={members}
            shortName={shortName}
            teamId={_id}
            excuseYourself={handleExcuseYourself}
            users={users}
            usersFetchErrMsg={usersFetchErrMsg}
          />
        ))}
        {error.length > 0 && <StyledErrorText>{error}</StyledErrorText>}
      </Row>
      <ToastContainer />
    </>
  );
}
