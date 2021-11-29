import axios, { AxiosError } from "axios";
import { TAttendee } from "../types/attendee";
import { TMeetingData } from "../types/meeting";

export type TAddMeetingInput = {
  name: string;
  description: string;
  date: string;
  startTimeHour: number;
  startTimeMinute: number;
  endTimeHour: number;
  endTimeMinute: number;
  attendees: string;
};

const addMeetingURL = `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/meetings`;

export const addMeeting = async (
  formData: TAddMeetingInput,
  token?: string
) => {
  const {
    name,
    date,
    description,
    startTimeHour,
    startTimeMinute,
    endTimeHour,
    endTimeMinute,
    attendees,
  } = formData;

  const meetingData = {
    name,
    date,
    description,
    startTime: {
      hours: startTimeHour,
      minutes: startTimeMinute,
    },
    endTime: {
      hours: endTimeHour,
      minutes: endTimeMinute,
    },
    attendees: attendees.split(","),
  };
  try {
    if (token) {
      await axios.post(addMeetingURL, meetingData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      return {};
    }
  } catch (error) {
    return {
      error: (error as AxiosError).response?.data.message,
    };
  }
  return {
    error: "Oops! An unexpected error happened!",
  };
};

export const searchMeetings = async (
  searchOption: string,
  searchPhrase: string,
  token?: string
) => {
  try {
    if (token) {
      const response = await axios.get(
        `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/meetings?period=${searchOption}&search=${searchPhrase}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      return { data: response.data };
    }
  } catch (err) {
    return { error: (err as AxiosError).response?.data.message };
  }
  return {
    error: "Oops! An unexpected error happened!",
  };
};

export const handleExcuseYourself = async (
  meetingId: string,
  searchResultsData: TMeetingData[],
  token?: string
) => {
  try {
    if (token) {
      await axios.patch(
        `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/meetings/${meetingId}?action=remove_attendee`,
        null,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return {
        // eslint-disable-next-line no-underscore-dangle
        data: searchResultsData.filter((meeting) => meeting._id !== meetingId),
      };
    }
  } catch (error) {
    return {
      error: false,
    };
  }
  return {
    error: false,
  };
};

export const addAttendee = async (
  meetingId: string,
  attendees: TAttendee[],
  memberOption: TAttendee,
  token?: string
) => {
  try {
    if (token) {
      await axios.patch(
        `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/meetings/${meetingId}?action=add_attendee&userId=${memberOption.userId}`,
        null,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return {
        data: [...attendees, memberOption],
      };
    }
  } catch (err) {
    return {
      error: (err as AxiosError).response?.data.message as string,
    };
  }
  return {
    error: "Opps! An unexpected error happened!",
  };
};
