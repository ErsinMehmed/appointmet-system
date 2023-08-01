import { makeObservable, observable, action } from "mobx";
import Swal from "sweetalert2";

import appointmentApi from "../api/Appointment";
import roomApi from "../api/Room";

import { rules } from "../rules/appointmentForm";
import { validateForm } from "../validations";
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

    const newTotalPages = Math.ceil(
      this.entities.pagination?.total_items / perPage
    );

    this.loadAppointments(
      this.currentPage > newTotalPages ? newTotalPages : this.currentPage
    );
  };

  setName = (name) => {
    this.name = name;
    this.loadAppointments();
  };

  setCurrentPage = (currentPage) => {
    this.currentPage = currentPage;
  };

  setPersonalNumber = (personalNumber) => {
    this.personalNumber = personalNumber;
    this.loadAppointments();
  };

  setDateTo = (dateTo) => {
    this.dateTo = dateTo;

    this.loadAppointments();
  };

  setDateFrom = (dateFrom) => {
    this.dateFrom = dateFrom;
    this.loadAppointments();
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
  loadAppointments = async (newTotalPages) => {
    this.setEntities(
      await appointmentApi.fetchAllAppointmentApi(
        newTotalPages ?? this.currentPage,
        this.perPage,
        this.personalNumber,
        this.name,
        this.dateFrom,
        this.dateTo
      )
    );
  };

  // Save record
  saveRecord = async () => {
    this.setIsSaving(true);
    this.setErrorsBag(validateForm(this.formData, rules));

    if (Object.keys(this.errorsBag).length) {
      this.setIsSaving(false);
      return;
    }

    const data = new FormData();
    data.append("name", this.formData.name);
    data.append("personal_number", this.formData.personal_number);
    data.append("time", this.formData.time);
    data.append("description", this.formData.description);
    data.append("room_id", this.formData.room_id);

    // Send a POST request to store form data.
    const response = await appointmentApi.createAppointmentApi(data);

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
  };

  // Update record
  updateRecord = async (uuid) => {
    this.setIsSaving(true);
    this.setErrorsBag(validateForm(this.formData, rules));

    if (Object.keys(this.errorsBag).length) {
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
    const response = await appointmentApi.updateAppointmentApi(data, uuid);

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

            this.loadAppointments();
          } else {
            message("error", response.message, false, false, 2500);
          }
        } catch (error) {
          message("error", "Oops, Something went wrong!", false, false, 2500);
        }
      }
    });
  };

  // Handle prev or next page
  handlePageChange = (direction) => {
    const newPage =
      direction === "next" ? this.currentPage + 1 : this.currentPage - 1;
    this.setCurrentPage(newPage);
    this.loadAppointments();
  };

  handlePageClick = (page) => {
    this.setCurrentPage(page);
    this.loadAppointments();
  };
}

export default new Appointment();
