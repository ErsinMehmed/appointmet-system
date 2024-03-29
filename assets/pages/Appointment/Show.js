import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";

import { formatDate } from "../../utils";

import BackButton from "../../components/BackButton";
import Loader from "../../components/Loader";
import SubmitButton from "../../components/SubmitButton";
import Textarea from "../../components/Textarea";
import AppointmentAction from "../../actions/Appointment";
import CommentAction from "../../actions/Comment";

function ShowAppointment() {
  const uuid = useParams().id;
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
    editingCommentId,
    editedCommentText,
    setComments,
    updateComment,
    setEditedCommentText,
    startEditing,
    saveComment,
    deleteComment,
    cancelEditing,
  } = CommentAction;

  // Fetch the appointment list upon component mount
  useEffect(() => {
    fetchAppointmentData(uuid);
  }, []);

  // Update form data state by setting the value
  const handleInputChange = (name, value) => {
    setComments({
      ...comments,
      [name]: value,
    });
  };

  // Render the spinner while loading
  if (!entity && !otherAppointments) {
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
                      Personal Number: {entity.personalNumber}
                    </span>
                  </div>
                </div>

                <h5 className="text-center mt-2 mb-1">Description</h5>
                <div className="widget-49-meeting-item">
                  {entity.description}
                </div>
              </div>
            </div>

            {entityComments.length > 0 && (
              <div className="mt-4 p-2">
                <div className="row d-flex justify-content-center">
                  <div>
                    <div className="headings d-flex justify-content-between align-items-center mb-2">
                      <h5>Comments ({entityComments.length})</h5>
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
                                  onClick={() =>
                                    updateComment(comment.id, uuid)
                                  }
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
                                  onClick={() =>
                                    startEditing(comment.id, entityComments)
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  className="btn btn-danger mx-1"
                                  onClick={() =>
                                    deleteComment(comment.id, uuid)
                                  }
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
            )}

            <div className="px-2 mb-3">
              <div className="d-flex flex-row align-items-start">
                <Textarea
                  label="Add comment"
                  value={comments.text}
                  id="text"
                  name="text"
                  onChange={(value) => handleInputChange("text", value)}
                  errors={errorsBag}
                />
              </div>

              <SubmitButton
                isSaving={isSaving}
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
                            Personal Number: {otherAppointment.personalNumber}
                          </span>
                        </div>
                      </div>

                      <h5 className="text-center mt-2 mb-1">Description</h5>

                      <div className="widget-49-meeting-item text-center">
                        {otherAppointment.description}
                      </div>
                    </div>
                  </div>

                  {commentOtherAppointments.length > 0 && (
                    <div className="mt-4 p-2">
                      <div className="row d-flex justify-content-center">
                        <div>
                          <div className="headings d-flex justify-content-between align-items-center mb-2">
                            <h5>Comments</h5>
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

                                    <span className="me-3">
                                      {formatDate(comment.date)}
                                    </span>
                                  </div>
                                </div>
                              ) : null
                            )}
                        </div>
                      </div>
                    </div>
                  )}
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
