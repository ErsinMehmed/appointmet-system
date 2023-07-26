import { makeObservable, observable, action } from "mobx";
import Swal from "sweetalert2";

import roomApi from "../api/Room";

import { rules } from "../rules/roomForm";
import { validateFields } from "../validations";
import { message } from "../utils";

class Room {
  formData = {
    name: "",
    number: null,
  };

  entity = [];
  isSaving = false;
  errorsBag = [];

  constructor() {
    makeObservable(this, {
      formData: observable,
      entity: observable,
      isSaving: observable,
      errorsBag: observable,
      setFormData: action,
      setEntity: action,
      setIsSaving: action,
      setErrorsBag: action,
    });
  }

  setFormData = (formData) => {
    this.formData = formData;
  };

  setEntity = (entity) => {
    this.entity = entity;
  };

  setIsSaving = (isSaving) => {
    this.isSaving = isSaving;
  };

  setErrorsBag = (errorsBag) => {
    this.errorsBag = errorsBag;
  };

  // Get all rooms data from controller
  fetchRoom = async () => {
    this.setRoom(await roomApi.fetchAllRoomsApi());
  };

  // Get appointment data from controller
  fetchAppointmentData = async (uuid) => {
    const { entity, otherAppointments, comments, commentOtherAppointments } =
      await appointmentApi.fetchAppointmentDataApi(uuid);

    this.setEntity(entity);
    this.setOtherAppointments(otherAppointments);
    this.setEntityComments(comments);
    this.setCommentOtherAppointments(commentOtherAppointments);
  };

  // Get appointment data from controller
  fetchAppointment = async (uuid) => {
    this.setEntity(await appointmentApi.fetchAppointmentApi(uuid));
  };

  // Get all appointments data from controller
  fetchAllAppointments = async (
    page,
    perPage,
    personalNumber,
    name,
    dateFrom,
    dateTo
  ) => {
    this.setEntities(
      await appointmentApi.fetchAllAppointmentApi(
        page,
        perPage,
        personalNumber,
        name,
        dateFrom,
        dateTo
      )
    );
  };

  // Save record
  saveRecord = async () => {
    this.setIsSaving(true);
    const data = new FormData();
    const errors = validateFields(this.formData, rules);

    if (Object.keys(errors).length) {
      this.setErrorsBag(errors);
      this.setIsSaving(false);
      return;
    }

    data.append("name", this.formData.name);
    data.append("number", this.formData.number);

    // Send a POST request to store form data.
    await roomApi
      .createRoomApi(data)
      .then((response) => {
        message(
          "success",
          response ?? "Room has been added successfully!",
          true
        );
        this.setIsSaving(false);
        this.setFormData({
          name: "",
          number: null,
        });
        this.setErrorsBag([]);
        this.setIsSaving(false);
      })
      .catch((error) => {
        if (
          error.response.status === 400 &&
          error.response.data.errors &&
          error.response.data.errors.length > 0
        ) {
          this.setErrorsBag(error.response.data.errors);
        } else if (error.response.status === 404) {
          this.setErrorsBag(["An error occurred while creating the room"]);
        } else {
          this.setErrorsBag(["Oops, something went wrong!"]);
        }

        this.setIsSaving(false);
      });
  };

  // Update record
  updateRecord = async (uuid) => {
    this.setIsSaving(true);

    const errors = validateFields(this.formData, rules);

    if (Object.keys(errors).length) {
      this.setErrorsBag(errors);
      this.setIsSaving(false);
      return;
    }

    const data = {
      name: this.formData.name,
      personal_number: this.formData.personal_number,
      time: this.formData.time,
      description: this.formData.description,
      room_id: this.formData.room_id,
    };

    // Send a PUT request to update form data.
    await appointmentApi
      .updateAppointmentApi(data, uuid)
      .then((response) => {
        message(
          "success",
          response ?? "Appointment has been updated successfully!",
          true
        );
        this.setErrorsBag([]);
        this.setIsSaving(false);
      })
      .catch((error) => {
        if (
          (error.response.status =
            400 &&
            error.response.data.errors &&
            error.response.data.errors.length > 0)
        ) {
          this.setErrorsBag(error.response.data.errors);
        } else if ((error.response.status = 404)) {
          this.setErrorsBag(["No appointment found"]);
        } else {
          this.setErrorsBag(["Oops, something went wrong!"]);
        }

        this.setIsSaving(false);
      });
  };

  // Delete record
  deleteRecord = (uuid) => {
    Swal.fire({
      title: "Are you sure you want to delete this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async () => {
      try {
        const response = await appointmentApi.deleteAppointmentApi(uuid);
        message(
          "success",
          response ?? "Appointment has been deleted successfully!",
          false,
          false,
          1000
        );

        this.fetchAllAppointments(this.currentPage);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.setErrorsBag(["No appointment found"]);
        }
        message("error", "Oops, Something went wrong!", false, false, 1000);
      }
    });
  };
}

export default new Room();
