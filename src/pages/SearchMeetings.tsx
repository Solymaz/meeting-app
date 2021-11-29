import React, { useContext, useEffect, useState } from "react";
import Select, { ActionMeta, MultiValue, SingleValue } from "react-select";
import makeAnimated from "react-select/animated";
import { Alert, Form } from "react-bootstrap";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../contexts/authContext";
import MeetingCard from "../components/MeetingCard";
import { TMeetingData } from "../types/meeting";
import { TOptionType } from "../types/option";
import StyledButton from "../components/Button";
import StyledForm from "../components/Form";
import StyledTextarea from "../components/Textarea";
import StyledTitle from "../components/Title";
import allUsers from "../services/user";
import "react-toastify/dist/ReactToastify.css";
import { handleExcuseYourself, searchMeetings } from "../services/meetings";

const StyledSection = styled.section`
  padding: 20px;
`;
const StyledH3 = styled.h3`
  margin-top: 10px;
`;

const animatedComponents = makeAnimated();
const meetingsOptions = [
  { value: "all", label: "All" },
  { value: "present", label: "Today" },
  { value: "future", label: "Upcoming" },
  { value: "past", label: "Past" },
];

export default function SearchMeetings() {
  const [searchOption, setSearchOption] = useState("future");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [searchResultsData, setSerachResultsData] = useState<TMeetingData[]>(
    []
  );
  const [searchErrMsg, setSearchErrMsg] = useState("");
  const [showSearchErrMsg, setShowSearchErrMsg] = useState(false);
  const [users, setUsers] = useState([]);
  const [membersErrMsg, setMembersErrMsg] = useState("");
  const [showMembersErrMsg, setShowMembersErrMsg] = useState(false);
  const { user } = useContext(AuthContext);
  const { token } = user;
  const [excusedYourself, setExcusedYourself] = useState<boolean>();

  useEffect(() => {
    async function fetch() {
      const result = await searchMeetings(searchOption, searchPhrase, token);
      if (result.data) {
        setSerachResultsData(result.data);
        setShowSearchErrMsg(false);
      } else {
        setSearchErrMsg(result.error);
        setShowSearchErrMsg(true);
      }
    }
    fetch();
  }, [searchPhrase, searchOption, token]);

  useEffect(() => {
    async function getUsers() {
      const result = await allUsers(token);

      if (result.data) {
        setUsers(result.data);
      } else {
        setShowMembersErrMsg(true);
        setMembersErrMsg(result.error);
      }
    }
    getUsers();
  }, []);

  const excuseYourself = async (meetingId: string) => {
    const result = await handleExcuseYourself(
      meetingId,
      searchResultsData,
      token
    );
    if (result.data) {
      setSerachResultsData(result.data);
      setExcusedYourself(true);
    } else {
      setExcusedYourself(result.error);
    }
  };

  useEffect(() => {
    if (excusedYourself) {
      toast.success("You successfully excused yourself! 🙂");
    } else if (excusedYourself !== undefined) {
      toast.error("Something went wrong ☹ Please try again!");
    }
  }, [excusedYourself]);

  return (
    <>
      <StyledForm>
        <StyledSection>
          <StyledTitle>Search for meetings</StyledTitle>
          <hr />
          <Form.Group className="w-100" controlId="date">
            <Form.Label>Date</Form.Label>
            <Select
              closeMenuOnSelect
              components={animatedComponents}
              defaultValue={meetingsOptions[2]}
              options={meetingsOptions}
              onChange={(
                option: SingleValue<TOptionType> | MultiValue<TOptionType>,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                actionMeta: ActionMeta<TOptionType>
              ) => {
                setSearchOption((option as TOptionType)?.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3 mt-3" controlId="searchForMeeting">
            <Form.Label>Search for</Form.Label>
            <StyledTextarea
              name="search for meetings"
              id="search"
              cols={30}
              rows={2}
              placeholder="Search using words which describe the meeting"
              value={searchPhrase}
              onChange={(event) => {
                setSearchPhrase(event.target.value);
              }}
            />
          </Form.Group>
          <StyledButton variant="primary" type="submit">
            Search
          </StyledButton>
        </StyledSection>
      </StyledForm>
      {showSearchErrMsg && <Alert variant="danger mt-3">{searchErrMsg}</Alert>}
      {searchResultsData.length > 0 && (
        <StyledH3>Meetings matching search criteria</StyledH3>
      )}
      {searchResultsData
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((result) => (
          <MeetingCard
            // eslint-disable-next-line no-underscore-dangle
            key={result._id}
            searchResultData={result}
            excuseYourself={excuseYourself}
            users={users}
            error={showMembersErrMsg ? membersErrMsg : ""}
          />
        ))}
      <ToastContainer />
    </>
  );
}
