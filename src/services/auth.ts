import axios, { AxiosError } from "axios";

const registrationURL = `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/auth/register`;
const loginURL = `${process.env.REACT_APP_MEETING_SERVICE_URL}/api/auth/login`;

export const registration = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    await axios.post(
      registrationURL,
      {
        name,
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return {};
  } catch (error) {
    return { error: (error as AxiosError).response?.data.message };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      loginURL,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return {
      data: response.data,
    };
  } catch (error) {
    return { error: (error as AxiosError).response?.data.message };
  }
};
