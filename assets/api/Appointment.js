import axios from "axios";
import { path } from "../config";

class Appointment {
  fetchAllAppointmentApi = async () => {
    try {
      const response = await axios.get(`${path}/api/appointments`);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  fetchAppointmentApi = async (uuid) => {
    try {
      const response = await axios.get(`${path}/api/appointments/edit/${uuid}`);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  fetchAppointmentDataApi = async (uuid) => {
    try {
      const response = await axios.get(`${path}/api/appointments/show/${uuid}`);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  createAppointmentApi = async (data) => {
    try {
      const response = await axios.post(`${path}/api/appointments`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  updateAppointmentApi = async (data, uuid) => {
    try {
      const response = await axios.put(
        `${path}/api/appointments/${uuid}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  deleteAppointmentApi = async (uuid) => {
    try {
      const response = await axios.delete(`${path}/api/appointments/${uuid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export default new Appointment();
