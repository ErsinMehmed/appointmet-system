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
}

export default new Room();
