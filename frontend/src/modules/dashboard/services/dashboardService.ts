import axios from "axios";

const API =
  "http://127.0.0.1:8000";

export const fetchSessions =
  async (token: string) => {

    const response = await axios.get(

      `${API}/sessions/my-sessions`,

      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    return response.data;
};