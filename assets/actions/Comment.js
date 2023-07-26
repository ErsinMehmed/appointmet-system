import { makeObservable, observable, action } from "mobx";
import Swal from "sweetalert2";
import axios from "axios";

import commentApi from "../api/Comment";
import AppointmentAction from "./Appointment";

import { rules } from "../rules/commentForm";
import { validateFields } from "../validations";
import { message } from "../utils";

class Comment {
  comments = {};
  entity = [];
  errorsBag = [];
  isSaving = false;
  editingCommentId = null;
  editedCommentText = "";

  constructor() {
    makeObservable(this, {
      comments: observable,
      isSaving: observable,
      errorsBag: observable,
      editingCommentId: observable,
      editedCommentText: observable,
      setIsSaving: action,
      setComments: action,
      setErrorsBag: action,
      setEditingCommentId: action,
      setEditedCommentText: action,
    });
  }

  setEditedCommentText = (editedCommentText) => {
    this.editedCommentText = editedCommentText;
  };

  setEditingCommentId = (editingCommentId) => {
    this.editingCommentId = editingCommentId;
  };

  setIsSaving = (isSaving) => {
    this.isSaving = isSaving;
  };

  setComments = (comments) => {
    this.comments = comments;
  };

  setErrorsBag = (errorsBag) => {
    this.errorsBag = errorsBag;
  };

  saveComment = async (appointmentId, uuid) => {
    this.setIsSaving((prevIsSavingMap) => ({
      ...prevIsSavingMap,
      [appointmentId]: true,
    }));

    const data = new FormData();
    const currentDate = new Date();

    // Perform validation for all fields.
    const errors = validateFields(
      { text: this.comments[appointmentId] || "" },
      rules
    );

    if (Object.keys(errors).length) {
      this.setErrorsBag(errors);
      this.setIsSaving((prevIsSavingMap) => ({
        ...prevIsSavingMap,
        [appointmentId]: false,
      }));

      return;
    }

    data.append("appointment_id", appointmentId);
    data.append("text", this.comments[appointmentId]);
    data.append("date", currentDate.toISOString().split("T")[0]);

    // Send a POST request to create record.
    await commentApi
      .createCommentApi(data)
      .then((response) => {
        message(
          "success",
          response ?? "Comment has been added successfully!",
          true
        );
        this.setErrorsBag([]);
        this.setComments((prevComments) => ({
          ...prevComments,
          [appointmentId]: "",
        }));
        this.setIsSaving((prevIsSavingMap) => ({
          ...prevIsSavingMap,
          [appointmentId]: false,
        }));

        AppointmentAction.fetchAppointmentData(uuid);
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
          this.setErrorsBag(["An error occurred while creating the comment"]);
        } else {
          this.setErrorsBag(["Oops, something went wrong!"]);
        }

        this.setIsSaving((prevIsSavingMap) => ({
          ...prevIsSavingMap,
          [appointmentId]: false,
        }));
      });
  };

  cancelEditing = () => {
    this.setEditingCommentId(null);
    this.setEditedCommentText("");
  };

  // Update comment
  updateComment = async (commentId, uuid) => {
    await commentApi
      .updateCommentApi({ text: this.editedCommentText }, commentId)
      .then((response) => {
        message(
          "success",
          response ?? "Comment has been updated successfully!",
          true
        );
        this.setEditingCommentId(null);
        this.setEditedCommentText("");

        AppointmentAction.fetchAppointmentData(uuid);
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
          this.setErrorsBag(["No comment found"]);
        } else {
          this.setErrorsBag(["Oops, something went wrong!"]);
        }
      });
  };

  // Delete comment
  deleteComment = (commentId, uuid) => {
    Swal.fire({
      title: "Are you sure you want to delete this comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await commentApi
          .deleteCommentApi(commentId)
          .then((response) => {
            message(
              "success",
              response ?? "Comment has been deleted successfully!",
              false,
              false,
              2000
            );

            AppointmentAction.fetchAppointmentData(uuid);
          })
          .catch((error) => {
            if ((error.response.status = 404)) {
              this.setErrorsBag(["Not comment found"]);
            }
          });
      }
    });
  };
}

export default new Comment();
