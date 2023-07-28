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

  entities = [];
  isSaving = false;
  errorsBag = [];
  currentPage = 1;
  perPage = 10;
  name = "";
  roomNumber = null;

  constructor() {
    makeObservable(this, {
      formData: observable,
      entities: observable,
      isSaving: observable,
      errorsBag: observable,
      currentPage: observable,
      perPage: observable,
      name: observable,
      roomNumber: observable,
      setFormData: action,
      setEntities: action,
      setIsSaving: action,
      setErrorsBag: action,
      setCurrentPage: action,
      setPerPage: action,
      setName: action,
      setRoomNumber: action,
    });
  }

  setFormData = (formData) => {
    this.formData = formData;
  };

  setEntities = (entities) => {
    this.entities = entities;
  };

  setIsSaving = (isSaving) => {
    this.isSaving = isSaving;
  };

  setErrorsBag = (errorsBag) => {
    this.errorsBag = errorsBag;
  };

  setCurrentPage = (currentPage) => {
    this.currentPage = currentPage;
  };

  setPerPage = (perPage) => {
    this.perPage = perPage;
    this.fetchAllRooms(this.currentPage, perPage, this.name, this.roomNumber);
  };

  setName = (name) => {
    this.name = name;
    this.fetchAllRooms(this.currentPage, this.perPage, name, this.roomNumber);
  };

  setRoomNumber = (roomNumber) => {
    this.roomNumber = roomNumber;
    this.fetchAllRooms(this.currentPage, this.perPage, this.name, roomNumber);
  };

  // // Get all rooms data from controller
  // fetchRoom = async () => {
  //   this.setRoom(await roomApi.fetchAllRoomsApi());
  // };

  // // Get appointment data from controller
  // fetchAppointmentData = async (uuid) => {
  //   const { entity, otherAppointments, comments, commentOtherAppointments } =
  //     await appointmentApi.fetchAppointmentDataApi(uuid);

  //   this.setEntity(entity);
  //   this.setOtherAppointments(otherAppointments);
  //   this.setEntityComments(comments);
  //   this.setCommentOtherAppointments(commentOtherAppointments);
  // };

  // // Get appointment data from controller
  // fetchAppointment = async (uuid) => {
  //   this.setEntity(await appointmentApi.fetchAppointmentApi(uuid));
  // };

  // Get all rooms data from controller
  fetchAllRooms = async (page, perPage, name, roomNumber) => {
    this.setEntities(
      await roomApi.fetchAllRoomsApi(page, perPage, name, roomNumber)
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
    await roomApi.createRoomApi(data).then((response) => {
      if (response.status) {
        message(
          "success",
          response.message ?? "Room has been added successfully!",
          true
        );
        this.setIsSaving(false);
        this.setFormData({
          name: "",
          number: null,
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
  deleteRecord = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this room?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await roomApi.deleteRoomApi(id);
          console.log(response);
          if (response.status) {
            message(
              "success",
              response.message ?? "Room has been deleted successfully!",
              false,
              false,
              2500
            );

            this.fetchAllRooms(this.currentPage, this.perPage);
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
    this.fetchAllRooms(
      this.currentPage,
      this.perPage,
      this.name,
      this.roomNumber
    );
  };

  // Handle prev page
  handlePrevPage = () => {
    this.setCurrentPage(this.currentPage - 1);
    this.fetchAllRooms(
      this.currentPage,
      this.perPage,
      this.name,
      this.roomNumber
    );
  };

  handlePageClick = (page) => {
    this.setCurrentPage(page);
    this.fetchAllRooms(
      this.currentPage,
      this.perPage,
      this.name,
      this.roomNumber
    );
  };
}

export default new Room();
