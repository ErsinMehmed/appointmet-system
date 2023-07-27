import axios from "axios";
import { path } from "../config";

class Room {
  fetchRoomsApi = async () => {
    try {
      const response = await axios.get(`${path}/api/rooms`);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  fetchAllRoomsApi = async (page, perPage, name, roomNumber) => {
    try {
      let url = `${path}/api/all-rooms?page=${page ?? 1}&per_page=${
        perPage ?? 10
      }`;

      if (name) {
        url += `&name=${name}`;
      }

      if (roomNumber) {
        url += `&room_number=${roomNumber}`;
      }

      const response = await axios.get(url);
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

  deleteRoomApi = async (id) => {
    try {
      const response = await axios.delete(`${path}/api/rooms/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export default new Room();
