import { makeObservable, observable, action } from "mobx";
import Swal from "sweetalert2";
import axios from "axios";

import { rules } from "../rules/appointmentFormRules";
import { validateFields } from "../validations";
import { message } from "../utils";
import { path } from "../config";

class Appointment {
  formData = {
    name: "",
    personal_number: null,
    time: "",
    description: "",
    room_id: null,
  };

  entity = [];
  entities = [];
  isSaving = false;
  errorsBag = [];
  room = [];
  dateFrom = "";
  dateTo = "";
  personalNumber = "";
  currentPage = 1;
  name = "";
  perPage = 10;
  totalPages = null;
  otherAppointments = [];
  entityComments = [];
  commentOtherAppointments = [];

  constructor() {
    makeObservable(this, {
      totalPages: observable,
      perPage: observable,
      name: observable,
      dateFrom: observable,
      dateTo: observable,
      personalNumber: observable,
      currentPage: observable,
      entity: observable,
      entities: observable,
      formData: observable,
      isSaving: observable,
      errorsBag: observable,
      room: observable,
      otherAppointments: observable,
      entityComments: observable,
      commentOtherAppointments: observable,
      setPerPage: action,
      setName: action,
      setDateFrom: action,
      setDateTo: action,
      setCurrentPage: action,
      setPersonalNumber: action,
      setEntity: action,
      setEntities: action,
      setFormData: action,
      setIsSaving: action,
      setErrorsBag: action,
      setRoom: action,
      setOtherAppointments: action,
      setEntityComments: action,
      setCommentOtherAppointments: action,
    });
  }

  setOtherAppointments = (otherAppointments) => {
    this.otherAppointments = otherAppointments;
  };

  setEntityComments = (entityComments) => {
    this.entityComments = entityComments;
  };

  setCommentOtherAppointments = (commentOtherAppointments) => {
    this.commentOtherAppointments = commentOtherAppointments;
  };

  setTotalPages = (totalPages) => {
    this.totalPages = totalPages;
  };

  setPerPage = (perPage) => {
    this.perPage = perPage;
  };

  setName = (name) => {
    this.name = name;
  };

  setCurrentPage = (currentPage) => {
    this.currentPage = currentPage;
  };

  setPersonalNumber = (personalNumber) => {
    this.personalNumber = personalNumber;
  };

  setDateTo = (dateTo) => {
    this.dateTo = dateTo;
  };

  setDateFrom = (formData) => {
    this.formData = formData;
  };

  setEntity = (entity) => {
    this.entity = entity;
  };

  setEntities = (entities) => {
    this.entities = entities;
  };

  setFormData = (formData) => {
    this.formData = formData;
  };

  setIsSaving = (isSaving) => {
    this.isSaving = isSaving;
  };

  setErrorsBag = (errorsBag) => {
    this.errorsBag = errorsBag;
  };

  setRoom = (room) => {
    this.room = room;
  };

  // Get all rooms data from controller
  fetchRoom = () => {
    axios
      .get(`${path}/api/rooms`)
      .then((response) => {
        this.setRoom(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Get appointment data from controller
  fetchAppointmentData = (uuid) => {
    axios
      .get(`${path}/api/appointments/show/${uuid}`)
      .then((response) => {
        const {
          entity,
          otherAppointments,
          comments,
          commentOtherAppointments,
        } = response.data;
        this.setEntity(entity);
        this.setOtherAppointments(otherAppointments);
        this.setEntityComments(comments);
        this.setCommentOtherAppointments(commentOtherAppointments);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Get appointment data from controller
  fetchAppointment = (uuid) => {
    axios
      .get(`${path}/api/appointments/edit/${uuid}`)
      .then((response) => {
        this.setEntity(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Get all appointments data from controller
  fetchAllAppointments = () => {
    axios
      .get(`${path}/api/appointments`)
      .then((response) => {
        this.setEntities(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Save record
  saveRecord = () => {
    this.setIsSaving(true);
    const data = new FormData();
    const errors = validateFields(this.formData, rules);

    if (Object.keys(errors).length) {
      this.setErrorsBag(errors);
      this.setIsSaving(false);
      return;
    }

    data.append("name", this.formData.name);
    data.append("personal_number", this.formData.personal_number);
    data.append("time", this.formData.time);
    data.append("description", this.formData.description);
    data.append("room_id", this.formData.room_id);

    // Send a POST request to store form data.
    axios
      .post(`${path}/api/appointments`, data)
      .then((response) => {
        message(
          "success",
          response.data ?? "Appointment has been added successfully!",
          true
        );
        this.setIsSaving(false);
        this.setFormData({
          name: "",
          personal_number: null,
          time: "",
          description: "",
          room_id: null,
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
          this.setErrorsBag([
            "An error occurred while creating the appointment",
          ]);
        } else {
          this.setErrorsBag(["Oops, something went wrong!"]);
        }

        this.setIsSaving(false);
      });
  };

  // Update record
  updateRecord = (uuid) => {
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
    axios
      .put(`${path}/api/appointments/${uuid}`, data)
      .then((response) => {
        message(
          "success",
          response.data ?? "Appointment has been updated successfully!",
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
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${path}/api/appointments/${uuid}`)
          .then((response) => {
            message(
              "success",
              response.data ?? "Appointment has been deleted successfully!",
              false,
              false,
              1000
            );

            this.fetchAllAppointments();
          })
          .catch((error) => {
            if ((error.response.status = 404)) {
              this.setErrorsBag(["No appointment found"]);
            }

            message("error", "Oops, Something went wrong!", false, false, 1000);
          });
      }
    });
  };

  // Data filter based on date range, name, and personal number.
  filterAppointments = (appointments) => {
    const filteredAppointments = appointments.filter((appointment) => {
      const date = new Date(appointment.time);
      const filterFromDate = this.dateFrom ? new Date(this.dateFrom) : null;
      const filterToDate = this.dateTo ? new Date(this.dateTo) : null;
      const clientName = appointment.name
        .toLowerCase()
        .includes(name.toLowerCase());
      const appointmentPersonalNumber = appointment.personalNumber.includes(
        this.personalNumber
      );

      if (filterFromDate && date < filterFromDate) {
        return false;
      }

      if (filterToDate && date > filterToDate) {
        return false;
      }

      if (this.personalNumber && !appointmentPersonalNumber) {
        return false;
      }

      if (name && !clientName) {
        return false;
      }

      return true;
    });

    return filteredAppointments;
  };

  // Handle next page
  handleNextPage = () => {
    if (this.currentPage < this.totalPages) {
      this.setCurrentPage(this.currentPage + 1);
    }
  };

  // Handle prev page
  handlePrevPage = () => {
    if (this.currentPage > 1) {
      this.setCurrentPage(this.currentPage - 1);
    }
  };
}

export default new Appointment();
