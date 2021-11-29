/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-plusplus */
import React, { useCallback, useContext, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Form, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components";
import { AuthContext } from "../contexts/authContext";
import StyledTitle from "../components/Title";
import StyledButton from "../components/Button";
import StyledForm from "../components/Form";
import StyledTextarea from "../components/Textarea";
import { addMeeting, TAddMeetingInput } from "../services/meetings";
import StyledFormControl from "../components/FormControl";
import StyledErrorText from "../components/Error";
import "react-toastify/dist/ReactToastify.css";

const StyledSection = styled.section`
  padding: 20px;
`;

const StyledHint = styled.p`
  color: whitesmoke;
  font-weight: 500;
`;

const StyledSelect = styled.select`
  border-radius: 5px;
  border: solid 1px lightgray;
  height: 2rem;
  width: 4rem;
  text-align: center;
`;

type TOption = number[];

const hourOption: TOption = [];
const minuteOption: TOption = [];

for (let i = 0; i < 24; i++) {
  hourOption[i] = i;
}

for (let i = 0; i < 60; i++) {
  minuteOption[i] = i;
}

export default function AddMeeting() {
  const [errMsg, setErrMsg] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<TAddMeetingInput>();

  const { user } = useContext(AuthContext);
  const { token } = user;

  const memoizedHandleSubmit = useCallback(
    handleSubmit(async (formData) => {
      const result = await addMeeting(formData, token);
      if (result.error) {
        setErrMsg(result.error);
      } else {
        toast.success("New meeting added! 👏");
        reset();
        setErrMsg("");
      }
    }),
    []
  );

  useEffect(() => {
    const subscription = watch(() => {
      setErrMsg("");
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <>
      <StyledForm onSubmit={memoizedHandleSubmit}>
        <StyledSection>
          <StyledTitle>Add a new meeting</StyledTitle>
          <hr />
          <Form.Group className="mb-3 mt-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <StyledFormControl
              type="text"
              placeholder="What is the name of the meeting"
              isInvalid={!!errors.name}
              {...register("name", { required: true })}
            />
            {!!errors.name && (
              <Form.Control.Feedback type="invalid" role="alert">
                Name is required!
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="w-100" controlId="date">
            <Form.Label>Date</Form.Label>
            <StyledFormControl
              type="date"
              isInvalid={!!errors.date}
              {...register("date", {
                onChange: (e) => format(parseISO(e.target.value), "yyyy-MM-dd"),
                required: true,
              })}
            />
            {!!errors.date && (
              <Form.Control.Feedback type="invalid" role="alert">
                Date is required!
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="mb-3 mt-3">
            <Form.Label htmlFor="startTime">Start time (hh:mm)</Form.Label>
            <div id="startTime">
              <StyledSelect
                aria-label="start hour"
                id="startTimeHour"
                {...register("startTimeHour", {
                  valueAsNumber: true,
                  required: true,
                })}
              >
                {hourOption.map((hour) => (
                  <option value={hour} key={hour}>
                    {hour}
                  </option>
                ))}
              </StyledSelect>
              <span> : </span>
              <StyledSelect
                aria-label="start minute"
                id="startTimeMinute"
                {...register("startTimeMinute", {
                  valueAsNumber: true,
                  required: true,
                })}
              >
                {minuteOption.map((minute) => (
                  <option value={minute} key={minute}>
                    {minute}
                  </option>
                ))}
              </StyledSelect>
            </div>
          </Form.Group>
          <Form.Group controlId="endTime">
            <Form.Label>End time (hh:mm)</Form.Label>
            <div id="endTime">
              <StyledSelect
                aria-label="end hour"
                id="endTimeHour"
                {...register("endTimeHour", {
                  valueAsNumber: true,
                  required: true,
                })}
              >
                {hourOption.map((hour) => (
                  <option value={hour} key={hour}>
                    {hour}
                  </option>
                ))}
              </StyledSelect>
              <span> : </span>
              <StyledSelect
                aria-label="end minute"
                id="endTimeMinute"
                {...register("endTimeMinute", {
                  valueAsNumber: true,
                  required: true,
                })}
              >
                {minuteOption.map((minute) => (
                  <option value={minute} key={minute}>
                    {minute}
                  </option>
                ))}
              </StyledSelect>
            </div>
          </Form.Group>
          <Form.Group className="mb-3 mt-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <StyledTextarea
              id="description"
              cols={30}
              rows={2}
              isInvalid={!!errors.description}
              placeholder="What is agenda of the meeting?"
              {...register("description", { required: true })}
            />
            {!!errors.description && (
              <StyledErrorText role="alert">
                Description is required!
              </StyledErrorText>
            )}
          </Form.Group>
          <Form.Group controlId="attendees">
            <Form.Label>EmailIDs of attendees, or team’s short</Form.Label>
            <StyledFormControl
              type="text"
              isInvalid={!!errors.attendees}
              placeholder="john@example.com, @annual-day, mark@example.com"
              {...register("attendees", { required: true })}
            />
            {!!errors.attendees && (
              <Form.Control.Feedback type="invalid" role="alert">
                At least one attendee is required!
              </Form.Control.Feedback>
            )}
            <StyledHint>
              Separate emailIds / team short names by commas - team short names
              always being with @
            </StyledHint>
          </Form.Group>
          <StyledButton variant="primary" type="submit">
            Add meeting
          </StyledButton>
          {errMsg.length > 0 && (
            <Alert variant="danger" className="mt-3">
              {errMsg}
            </Alert>
          )}
        </StyledSection>
      </StyledForm>
      <ToastContainer />
    </>
  );
}
