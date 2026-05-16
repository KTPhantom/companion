import axios from "axios";

const API =
  "http://127.0.0.1:8000";

export const createSession =
  async (
    token: string,
    subject: string,
    duration: number
  ) => {

    const response = await axios.post(

      `${API}/sessions/create`,

      {
        subject,
        duration
      },

      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    return response.data;
};