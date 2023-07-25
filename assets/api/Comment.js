import axios from "axios";
import { path } from "../config";

class Comment {
  createCommentApi = async (data) => {
    try {
      const response = await axios.post(`${path}/api/comments`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  updateCommentApi = async (data, id) => {
    try {
      const response = await axios.put(`${path}/api/comments/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  deleteCommentApi = async (id) => {
    try {
      const response = await axios.delete(`${path}/api/comments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export default new Comment();
