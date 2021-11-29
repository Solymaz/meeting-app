import axios, { AxiosError } from "axios";

const allUsersURL = `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/users`;

const allUsers = async (token?: string) => {
  try {
    if (token) {
      const response = await axios.get(allUsersURL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      return {
        data: response.data,
      };
    }
  } catch (err) {
    return {
      error: (err as AxiosError).response?.data.message,
    };
  }
  return {
    error: "An unexpected error happened!",
  };
};

export default allUsers;
