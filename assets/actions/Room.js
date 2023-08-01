import { makeObservable, observable, action } from "mobx";
import Swal from "sweetalert2";

import roomApi from "../api/Room";

import { rules } from "../rules/roomForm";
import { validateForm } from "../validations";
import { message } from "../utils";

class Room {
  formData = {
    name: "",
    number: null,
  };

  entity = [];
  entities = [];
  errorsBag = [];
  isSaving = false;
  name = "";
  roomNumber = null;
  currentPage = 1;
  perPage = 10;

  constructor() {
    makeObservable(this, {
      formData: observable,
      entity: observable,
      entities: observable,
      isSaving: observable,
      errorsBag: observable,
      currentPage: observable,
      perPage: observable,
      name: observable,
      roomNumber: observable,
      setFormData: action,
      setEntity: action,
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

  setEntity = (entity) => {
    this.entity = entity;
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

    const newTotalPages = Math.ceil(
      this.entities.pagination?.total_items / perPage
    );

    this.loadRooms(
      this.currentPage > newTotalPages ? newTotalPages : this.currentPage
    );
  };

  setName = (name) => {
    this.name = name;
    this.loadRooms();
  };

  setRoomNumber = (roomNumber) => {
    this.roomNumber = roomNumber;
    this.loadRooms();
  };

  // Get all rooms data from controller
  loadRooms = async (newTotalPages) => {
    this.setEntities(
      await roomApi.loadRoomsApi(
        newTotalPages ?? this.currentPage,
        this.perPage,
        this.name,
        this.roomNumber
      )
    );
  };

  // Get room data from controller
  fetchRoom = async (id) => {
    this.setEntity(await roomApi.fetchRoomApi(id));
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
    data.append("number", this.formData.number);

    // Send a POST request to store form data.
    const response = await roomApi.createRoomApi(data);

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
  };

  // Update record
  updateRecord = async (id) => {
    this.setIsSaving(true);
    this.setErrorsBag(validateForm(this.formData, rules));

    if (Object.keys(this.errorsBag).length) {
      this.setIsSaving(false);
      return;
    }

    const data = {
      name: this.formData.name,
      number: this.formData.number,
    };

    // Send a PUT request to update form data.
    const response = await roomApi.updateRoomApi(data, id);

    if (response.status) {
      message(
        "success",
        response.message ?? "Room has been updated successfully!",
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

          if (response.status) {
            message(
              "success",
              response.message ?? "Room has been deleted successfully!",
              false,
              false,
              2500
            );

            this.loadRooms();
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
    this.loadRooms();
  };

  handlePageClick = (page) => {
    this.setCurrentPage(page);
    this.loadRooms();
  };
}

export default new Room();
