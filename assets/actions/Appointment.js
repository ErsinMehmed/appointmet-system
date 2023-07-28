import { makeObservable, observable, action } from "mobx";
import Swal from "sweetalert2";

import appointmentApi from "../api/Appointment";
import roomApi from "../api/Room";

import { rules } from "../rules/appointmentForm";
import { validateFields } from "../validations";
import { message } from "../utils";

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
  errorsBag = [];
  room = [];
  otherAppointments = [];
  entityComments = [];
  commentOtherAppointments = [];
  dateFrom = "";
  dateTo = "";
  name = "";
  personalNumber = null;
  currentPage = 1;
  perPage = 10;
  isSaving = false;

  constructor() {
    makeObservable(this, {
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

  setPerPage = (perPage) => {
    this.perPage = perPage;
    this.fetchAllAppointments(
      this.currentPage,
      perPage,
      this.personalNumber,
      this.name,
      this.dateFrom,
      this.dateTo
    );
  };

  setName = (name) => {
    this.name = name;
    this.fetchAllAppointments(
      this.currentPage,
      this.perPage,
      this.personalNumber,
      name,
      this.dateFrom,
      this.dateTo
    );
  };

  setCurrentPage = (currentPage) => {
    this.currentPage = currentPage;
  };

  setPersonalNumber = (personalNumber) => {
    this.personalNumber = personalNumber;
    this.fetchAllAppointments(
      this.currentPage,
      this.perPage,
      personalNumber,
      this.name,
      this.dateFrom,
      this.dateTo
    );
  };

  setDateTo = (dateTo) => {
    this.dateTo = dateTo;

    this.fetchAllAppointments(
      this.currentPage,
      this.perPage,
      personalNumber,
      this.name,
      this.dateFrom,
      dateTo
    );
  };

  setDateFrom = (dateFrom) => {
    this.dateFrom = dateFrom;
    this.fetchAllAppointments(
      this.currentPage,
      this.perPage,
      personalNumber,
      this.name,
      dateFrom,
      this.dateTo
    );
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
  fetchRoom = async () => {
    this.setRoom(await roomApi.fetchRoomsApi());
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
    data.append("personal_number", this.formData.personal_number);
    data.append("time", this.formData.time);
    data.append("description", this.formData.description);
    data.append("room_id", this.formData.room_id);

    // Send a POST request to store form data.
    await appointmentApi.createAppointmentApi(data).then((response) => {
      if (response.status) {
        message(
          "success",
          response.message ?? "Appointment has been added successfully!",
          true
        );
        this.setFormData({
          name: "",
          personal_number: null,
          time: "",
          description: "",
          room_id: null,
        });
        this.setErrorsBag([]);
        this.setIsSaving(false);
      } else {
        this.setErrorsBag(response.errors);
        this.setIsSaving(false);
      }
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
    await appointmentApi.updateAppointmentApi(data, uuid).then((response) => {
      if (response.status) {
        message(
          "success",
          response.message ?? "Appointment has been updated successfully!",
          true
        );
        this.setErrorsBag([]);
        this.setIsSaving(false);
      } else {
        this.setErrorsBag(response.errors);
        this.setIsSaving(false);
      }
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await appointmentApi.deleteAppointmentApi(uuid);

          if (response.status) {
            message(
              "success",
              response.message ?? "Appointment has been deleted successfully!",
              false,
              false,
              2500
            );

            this.fetchAllAppointments(this.currentPage, this.perPage);
          } else {
            message("error", response.message, false, false, 2500);
          }
        } catch (error) {
          message("error", "Oops, Something went wrong!", false, false, 2500);
        }
      }
    });
  };

  // Handle next page
  handleNextPage = () => {
    this.setCurrentPage(this.currentPage + 1);
    this.fetchAllAppointments(
      this.currentPage,
      this.perPage,
      this.personalNumber,
      this.name,
      this.dateFrom,
      this.dateTo
    );
  };

  // Handle prev page
  handlePrevPage = () => {
    this.setCurrentPage(this.currentPage - 1);
    this.fetchAllAppointments(
      this.currentPage,
      this.perPage,
      this.personalNumber,
      this.name,
      this.dateFrom,
      this.dateTo
    );
  };

  handlePageClick = (page) => {
    this.setCurrentPage(page);
    this.fetchAllAppointments(
      page,
      this.perPage,
      this.personalNumber,
      this.name,
      this.dateFrom,
      this.dateTo
    );
  };
}

export default new Appointment();
