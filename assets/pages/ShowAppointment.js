import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import { message, formatDate } from "../utils";
import { path } from "../config";

import BackButton from "../components/BackButton";
import Loader from "../components/Loader";
import SubmitButton from "../components/SubmitButton";
import Textarea from "../components/Textarea";
import AppointmentAction from "../actions/Appointment";
import CommentAction from "../actions/Comment";

function ShowAppointment() {
  const uuid = useParams().id;
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const {
    entity,
    otherAppointments,
    entityComments,
    commentOtherAppointments,
    fetchAppointmentData,
  } = AppointmentAction;

  const {
    isSaving,
    comments,
    errorsBag,
    setComments,
    setErrorsBag,
    saveComment,
    deleteComment,
  } = CommentAction;

  // Fetch the appointment list upon component mount
  useEffect(() => {
    fetchAppointmentData(uuid);
  }, []);

  // Update form data state by setting the value
  const handleInputChange = (value, appointmentId) => {
    setComments({
      ...comments[appointmentId],
      [appointmentId]: value,
    });
  };

  const startEditing = (commentId) => {
    const comment = entityComments.find((c) => c.id === commentId);

    if (comment) {
      setEditingCommentId(commentId);
      setEditedCommentText(comment.text);
    }
  };

  const updateComment = (commentId) => {
    axios
      .put(`${path}/api/comments/${commentId}`, { text: editedCommentText })
      .then((response) => {
        message(
          "success",
          response.data ?? "Comment has been updated successfully!",
          true
        );
        setEditingCommentId(null);
        setEditedCommentText("");
        fetchAppointmentData();
      })
      .catch((error) => {
        if (
          (error.response.status =
            400 &&
            error.response.data.errors &&
            error.response.data.errors.length > 0)
        ) {
          setErrorsBag(error.response.data.errors);
        } else if ((error.response.status = 404)) {
          setErrorsBag(["No comment found"]);
        } else {
          setErrorsBag(["Oops, something went wrong!"]);
        }
      });
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditedCommentText("");
  };

  // Render the spinner while loading
  if (!entity) {
    return <Loader />;
  }

  return (
    <div className="px-5 mt-4">
      <div className="container">
        <BackButton />
        <h2 className="text-center mb-3">Appointment details</h2>

        <div className="row">
          <div className="card card-margin w-75 mx-auto">
            <div className="card-body">
              <div className="widget-49 d-flex flex-column align-items-center">
                <div className="widget-49-title-wrapper">
                  <div className="widget-49-date-primary">
                    <span className="widget-49-date-day">
                      {isNaN(new Date(entity.time).getDate())
                        ? "Invalid Date"
                        : new Date(entity.time).getDate()}
                    </span>

                    <span className="widget-49-date-month">
                      {new Date(entity.time).toLocaleString("en-US", {
                        month: "short",
                      })}
                    </span>
                  </div>

                  <div className="widget-49-meeting-info">
                    <span className="widget-49-pro-title fw-normal">
                      Name: {entity.name}
                    </span>

                    <span className="widget-49-meeting-time">
                      Date: {formatDate(entity.time)}
                    </span>

                    <span className="widget-49-meeting-time">
                      Personal Number: {entity.personal_number}
                    </span>
                  </div>
                </div>

                <h5 className="text-center mt-2 mb-1">Description</h5>
                <div className="widget-49-meeting-item">
                  {entity.description}
                </div>
              </div>
            </div>

            <div className="mt-4 p-2">
              <div className="row d-flex justify-content-center">
                <div>
                  <div className="headings d-flex justify-content-between align-items-center mb-2">
                    {entityComments.length > 0 && (
                      <h5>Comments ({entityComments.length})</h5>
                    )}
                  </div>

                  {entityComments &&
                    entityComments.map((comment, index) => (
                      <div className="card p-3 mb-3" key={index}>
                        {editingCommentId === comment.id ? (
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="user d-flex flex-row align-items-center">
                              <input
                                type="text"
                                value={editedCommentText}
                                onChange={(e) =>
                                  setEditedCommentText(e.target.value)
                                }
                                className="form-control"
                              />
                            </div>
                            <div>
                              <button
                                className="btn btn-success mx-1"
                                onClick={() => updateComment(comment.id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-secondary mx-1"
                                onClick={() => cancelEditing()}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="user d-flex flex-row align-items-center">
                              <span>
                                <span className="font-weight-bold">
                                  {comment.text}
                                </span>
                              </span>
                            </div>
                            <div>
                              <span className="me-3">
                                {formatDate(comment.date)}
                              </span>
                              <button
                                className="btn btn-primary mx-1"
                                onClick={() => startEditing(comment.id)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger mx-1"
                                onClick={() => deleteComment(comment.id, uuid)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="px-2 mb-3">
              <div className="d-flex flex-row align-items-start">
                <Textarea
                  label="Add comment"
                  value={comments[entity.id] || ""}
                  id="text"
                  name="text"
                  onChange={(value) => handleInputChange(value, entity.id)}
                  errors={errorsBag}
                />
              </div>

              <SubmitButton
                isSaving={isSaving[entity.id] || false}
                submit={() => saveComment(entity.id, uuid)}
                text="Post comment"
              />
            </div>
          </div>
        </div>
      </div>

      {otherAppointments.length > 0 && (
        <div>
          <h2 className="text-center mb-3">
            Others appointment with same client personal number
          </h2>

          <div className="row">
            {otherAppointments.map((otherAppointment, index) => (
              <div key={index} className="col-lg-4">
                <div className="card card-margin">
                  <div className="card-body">
                    <div className="widget-49">
                      <div className="widget-49-title-wrapper">
                        <div className="widget-49-date-primary">
                          <span className="widget-49-date-day">
                            {new Date(otherAppointment.time).getDate()}
                          </span>

                          <span className="widget-49-date-month">
                            {new Date(otherAppointment.time).toLocaleString(
                              "en-US",
                              { month: "short" }
                            )}
                          </span>
                        </div>

                        <div className="widget-49-meeting-info">
                          <span className="widget-49-pro-title fw-normal">
                            Name: {otherAppointment.name}
                          </span>

                          <span className="widget-49-meeting-time">
                            Date: {formatDate(otherAppointment.time)}
                          </span>

                          <span className="widget-49-meeting-time">
                            Personal Number: {otherAppointment.personal_number}
                          </span>
                        </div>
                      </div>

                      <h5 className="text-center mt-2 mb-1">Description</h5>
                      <div className="widget-49-meeting-item text-center">
                        {otherAppointment.description}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-2">
                    <div className="row d-flex justify-content-center">
                      <div>
                        <div className="headings d-flex justify-content-between align-items-center mb-2">
                          <div>Comments</div>
                        </div>

                        {commentOtherAppointments &&
                          commentOtherAppointments.map((comment, index) =>
                            comment.appointment_id === otherAppointment.id ? (
                              <div className="card p-3 mb-3" key={index}>
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="user d-flex flex-row align-items-center">
                                    <span>
                                      <span className="font-weight-bold">
                                        {comment.text}
                                      </span>
                                    </span>
                                  </div>

                                  <div>
                                    <span className="me-3">
                                      {formatDate(comment.date)}
                                    </span>

                                    <button
                                      className="btn btn-primary mx-1"
                                      onClick={() => deleteComment(comment.id)}
                                    >
                                      Edit
                                    </button>

                                    <button
                                      onClick={() =>
                                        deleteComment(comment.id, uuid)
                                      }
                                      className="btn btn-danger mx-1"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : null
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="px-2 mb-3">
                    <div className="d-flex flex-row align-items-start">
                      <Textarea
                        label="Add comment"
                        value={comments[otherAppointment.id] || ""}
                        id="text"
                        name="text"
                        onChange={(value) =>
                          handleInputChange(value, otherAppointment.id)
                        }
                        errors={errorsBag}
                      />
                    </div>

                    <SubmitButton
                      isSaving={isSaving[otherAppointment.id] || false}
                      submit={() => saveComment(otherAppointment.id, uuid)}
                      text="Post comment"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default observer(ShowAppointment);
