import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import { message, formatDate } from "../utils";
import { validateFields } from "../validations";
import { rules } from "../rules/commentFormRules";
import { path } from "../config";

import BackButton from "../components/BackButton";
import Loader from "../components/Loader";
import SubmitButton from "../components/SubmitButton";
import Textarea from "../components/Textarea";

function ViewAppointment() {
  const { id } = useParams();
  const [entity, setEntity] = useState(null);
  const [isSaving, setIsSaving] = useState({});
  const [comments, setComments] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [errorsBag, setErrorsBag] = useState([]);
  const [otherAppointments, setOtherAppointments] = useState([]);
  const [entityComments, setEntitComment] = useState([]);
  const [commentOtherAppointments, setCommentOtherAppointments] = useState([]);

  // Fetch the appointment list upon component mount
  useEffect(() => {
    fetchAppointmentData();
  }, []);

  // Get all data from controller
  const fetchAppointmentData = () => {
    axios
      .get(`${path}/api/appointments/show/${id}`)
      .then((response) => {
        const {
          entity,
          otherAppointments,
          comments,
          commentOtherAppointments,
        } = response.data;
        setEntity(entity);
        setOtherAppointments(otherAppointments);
        setEntitComment(comments);
        setCommentOtherAppointments(commentOtherAppointments);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Update form data state by setting the value
  const handleInputChange = (value, appointmentId) => {
    setComments((prevComments) => ({
      ...prevComments,
      [appointmentId]: value,
    }));
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

  const saveComment = (appointmentId) => {
    setIsSaving((prevIsSavingMap) => ({
      ...prevIsSavingMap,
      [appointmentId]: true,
    }));

    const data = new FormData();
    const currentDate = new Date();

    // Perform validation for all fields.
    const errors = validateFields(
      { text: comments[appointmentId] || "" },
      rules
    );

    if (Object.keys(errors).length) {
      setErrorsBag(errors);
      setIsSaving((prevIsSavingMap) => ({
        ...prevIsSavingMap,
        [appointmentId]: false,
      }));
      return;
    }

    data.append("appointment_id", appointmentId);
    data.append("text", comments[appointmentId]);
    data.append("date", currentDate.toISOString().split("T")[0]);

    // Send a POST request to create record.
    axios
      .post(`${path}/api/comments`, data)
      .then((response) => {
        message(
          "success",
          response.data ?? "Comments has been added successfully!",
          true
        );
        setErrorsBag([]);
        setComments((prevComments) => ({
          ...prevComments,
          [appointmentId]: "",
        }));
        setIsSaving((prevIsSavingMap) => ({
          ...prevIsSavingMap,
          [appointmentId]: false,
        }));
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
          setErrorsBag(["An error occurred while creating the comment"]);
        } else {
          setErrorsBag(["Oops, something went wrong!"]);
        }

        setIsSaving((prevIsSavingMap) => ({
          ...prevIsSavingMap,
          [appointmentId]: false,
        }));
      });
  };

  // Delete delete comment
  const deleteComment = (commentId) => {
    Swal.fire({
      title: "Are you sure you want to delete this comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${path}/api/comments/${commentId}`)
          .then((response) => {
            message(
              "success",
              response.data ?? "Comment has been deleted successfully!",
              false,
              false,
              1000
            );

            fetchAppointmentData();
          })
          .catch((error) => {
            if ((error.response.status = 404)) {
              setErrorsBag(["Not comment found"]);
            }
          });
      }
    });
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
                      {new Date(entity.time).getDate()}
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
                        {editingCommentId === comment.id ? ( // Check if the comment is being edited
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
                                onClick={() => deleteComment(comment.id)}
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
                submit={() => saveComment(entity.id)}
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
                                      onClick={() => deleteComment(comment.id)}
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
                      submit={() => saveComment(otherAppointment.id)}
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

export default ViewAppointment;
