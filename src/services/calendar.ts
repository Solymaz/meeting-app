import axios, { AxiosError } from "axios";

const viewCalendar = async (dateValue: string, token?: string) => {
  try {
    if (token) {
      const response = await axios.get(
        `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/calendar?date=${dateValue}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      return { data: response.data };
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
export default viewCalendar;
