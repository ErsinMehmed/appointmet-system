import axios from "axios";
import { path } from "../config";

class Appointment {
  fetchAllAppointmentApi = async (
    page,
    perPage,
    personalNumber,
    name,
    dateFrom,
    dateTo
  ) => {
    try {
      let url = `${path}/api/appointments?page=${page ?? 1}&per_page=${
        perPage ?? 10
      }`;

      if (name) {
        url += `&name=${name}`;
      }

      if (personalNumber) {
        url += `&personal_number=${personalNumber}`;
      }

      if (dateFrom) {
        url += `&date_from=${dateFrom}`;
      }

      if (dateTo) {
        url += `&date_to=${dateTo}`;
      }

      const response = await axios.get(url);
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
