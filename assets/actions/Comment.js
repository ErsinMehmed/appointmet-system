import { makeObservable, observable, action } from "mobx";
import Swal from "sweetalert2";
import axios from "axios";

import commentApi from "../api/Comment";
import AppointmentAction from "./Appointment";

import { rules } from "../rules/commentForm";
import { validateFields } from "../validations";
import { message } from "../utils";

class Comment {
  entity = [];
  errorsBag = [];
  comments = {};
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
    this.setIsSaving(true);

    const data = new FormData();
    const currentDate = new Date();

    // Perform validation for all fields.
    const errors = validateFields(this.comments, rules);

    if (Object.keys(errors).length) {
      this.setErrorsBag(errors);
      this.setIsSaving(false);
      return;
    }

    data.append("appointment_id", appointmentId);
    data.append("text", this.comments.text);
    data.append("date", currentDate.toISOString().split("T")[0]);

    // Send a POST request to create record.
    await commentApi.createCommentApi(data).then((response) => {
      if (response.status) {
        message(
          "success",
          response.message ?? "Comment has been added successfully!",
          true
        );
        this.setErrorsBag([]);
        this.setComments({ text: "" });
        this.setIsSaving(false);

        AppointmentAction.fetchAppointmentData(uuid);
      } else {
        this.setErrorsBag(response.errors);
        this.setIsSaving(false);
      }
    });
  };

  startEditing = (commentId, entityComments) => {
    const comment = entityComments.find((c) => c.id === commentId);

    if (comment) {
      this.setEditingCommentId(commentId);
      this.setEditedCommentText(comment.text);
    }
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
        if (response.status) {
          message(
            "success",
            response.message ?? "Comment has been updated successfully!",
            true
          );
          this.setEditingCommentId(null);
          this.setEditedCommentText("");

          AppointmentAction.fetchAppointmentData(uuid);
        } else {
          this.setErrorsBag(response.errors);
          this.setIsSaving(false);
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
        try {
          const response = await commentApi.deleteCommentApi(commentId);

          if (response.status) {
            message(
              "success",
              response.message ?? "Comment has been deleted successfully!",
              false,
              false,
              2500
            );

            AppointmentAction.fetchAppointmentData(uuid);
          } else {
            message("error", response.message, false, false, 2500);
          }
        } catch (error) {
          message("error", "Oops, Something went wrong!", false, false, 2500);
        }
      }
    });
  };
}

export default new Comment();
