import axios, { AxiosError } from "axios";
import { TTeamData } from "../pages/Teams";
import { TAttendee } from "../types/attendee";

const viewTeamsURL = `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/teams`;

export const viewTeams = async (token?: string) => {
  try {
    if (token) {
      const response = await axios.get(
        viewTeamsURL,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      return {
        data: response.data,
      };
    }
  } catch (error) {
    return { error: (error as AxiosError).response?.data.message };
  }
  return { error: "Opps! An unexpected error happened!" };
};

export const excuseYourself = async (
  teamId: string,
  teamsData: TTeamData[],
  token?: string
) => {
  try {
    if (token) {
      await axios.patch(
        `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/teams/${teamId}?action=remove_member`,
        null,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return {
        // eslint-disable-next-line no-underscore-dangle
        data: teamsData.filter((team) => team._id !== teamId),
      };
    }
  } catch (error) {
    return { error: (error as AxiosError).response?.data.message };
  }
  return { error: "Opps! An unexpected error happened!" };
};

export const addMember = async (
  teamId: string,
  memberOption: TAttendee,
  members: TAttendee[],
  token?: string
) => {
  try {
    if (token) {
      await axios.patch(
        `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/teams/${teamId}?action=add_member&userId=${memberOption?.userId}`,
        null,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (memberOption) {
        return {
          data: [...members, memberOption],
        };
      }
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

export type TAddTeamInput = {
  name: string;
  shortName: string;
  description: string;
};

export const addTeam = async (
  formData: TAddTeamInput,
  members: TAttendee[],
  token?: string
) => {
  const { name, shortName, description } = formData;

  const teamData = {
    name,
    description,
    shortName,
    members,
  };
  try {
    if (token) {
      const response = await axios.post(
        `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/teams`,
        teamData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      return {
        data: response.data,
      };
    }
  } catch (error) {
    return {
      error: (error as AxiosError).response?.data.message,
    };
  }
  return {
    error: "Opps! An unexpected error happened!",
  };
};
