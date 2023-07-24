import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { message } from "../utils";
import { validateFields } from "../validations";
import { rules } from "../rules/appointmentFormRules";
import { path } from "../config";

import BackButton from "../components/BackButton";
import ErrorAlert from "../components/ErrorAlert";
import Input from "../components/Input";
import Select from "../components/Select";
import Loader from "../components/Loader";
import SubmitButton from "../components/SubmitButton";
import Textarea from "../components/Textarea";

function EditAppointment() {
  const uuid = useParams().id;
  const [entity, setEntity] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorsBag, setErrorsBag] = useState([]);
  const [room, setRoom] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    personal_number: null,
    time: "",
    description: "",
    room_id: null,
  });

  // Fetch data
  useEffect(() => {
    fetchAppointment();
    fetchRoom();
  }, []);

  // Update the form data
  useEffect(() => {
    if (entity !== null) {
      setFormData({
        name: entity.appointment?.name,
        personal_number: entity.appointment?.personalNumber,
        time: entity.appointment?.time
          ? new Date(entity.appointment.time).toISOString().split("T")[0] // Update this line
          : "",
        description: entity.appointment?.description,
        room_id: entity.room?.number,
      });
    }
  }, [entity]);

  // Get all appointment data from controller
  const fetchAppointment = () => {
    axios
      .get(`${path}/api/appointments/edit/${uuid}`)
      .then((response) => {
        setEntity(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Fetch all room data from controller
  const fetchRoom = () => {
    axios
      .get(`${path}/api/rooms`)
      .then((response) => {
        setRoom(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Update form data state by setting the value
  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Update record
  const updateRecord = () => {
    setIsSaving(true);

    // Perform validation for all fields.
    const errors = validateFields(formData, rules);

    if (Object.keys(errors).length) {
      setErrorsBag(errors);
      setIsSaving(false);
      return;
    }

    const data = {
      name: formData.name,
      personal_number: formData.personal_number,
      time: formData.time,
      description: formData.description,
      room_id: formData.room_id,
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
        setErrorsBag([]);
        setIsSaving(false);
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
          setErrorsBag(["No appointment found"]);
        } else {
          setErrorsBag(["Oops, something went wrong!"]);
        }

        setIsSaving(false);
      });
  };

  // Render the spinner while loading
  if (!entity) {
    return <Loader />;
  }

  return (
    <div className="container">
      <h2 className="text-center mt-5 mb-3">Add Appointment</h2>

      <div className="card">
        <div className="card-header">
          <BackButton />
        </div>

        <div className="card-body">
          <ErrorAlert errors={errorsBag} />

          <form>
            <Input
              label="Name"
              value={formData.name}
              type="text"
              id="name"
              name="name"
              onChange={(value) => handleInputChange("name", value)}
              errors={errorsBag}
            />

            <Input
              label="Personal Number"
              value={formData.personal_number}
              type="text"
              id="personal-number"
              name="personal_number"
              maxLength="10"
              onChange={(value) => handleInputChange("personal_number", value)}
              errors={errorsBag}
            />

            <Input
              label="Choice date"
              value={formData.time}
              type="date"
              id="date"
              name="time"
              onChange={(value) => handleInputChange("time", value)}
              errors={errorsBag}
            />

            <Select
              label="Choice room"
              value={formData.room_id}
              onChange={(value) => handleInputChange("room_id", value)}
              id="room"
              name="room_id"
              options={room}
              errors={errorsBag}
            />

            <Textarea
              label="Description"
              value={formData.description}
              id="description"
              name="description"
              onChange={(value) => handleInputChange("description", value)}
              errors={errorsBag}
            />

            <SubmitButton
              isSaving={isSaving}
              submit={updateRecord}
              text="Update"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditAppointment;
