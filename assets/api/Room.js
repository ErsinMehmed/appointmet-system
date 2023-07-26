import axios from "axios";
import { path } from "../config";

class Room {
  fetchAllRoomsApi = async () => {
    try {
      const response = await axios.get(`${path}/api/rooms`);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  createRoomApi = async (data) => {
    try {
      const response = await axios.post(`${path}/api/rooms`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export default new Room();
