import React, { useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";

import BackButton from "../../components/BackButton";
import ErrorAlert from "../../components/ErrorAlert";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Loader from "../../components/Loader";
import SubmitButton from "../../components/SubmitButton";
import Textarea from "../../components/Textarea";
import AppointmentAction from "../../actions/Appointment";

function EditAppointment() {
  const uuid = useParams().id;
  const {
    entity,
    formData,
    isSaving,
    errorsBag,
    room,
    setFormData,
    fetchRoom,
    updateRecord,
    fetchAppointment,
  } = AppointmentAction;

  // Fetch data
  useEffect(() => {
    fetchAppointment(uuid);
    fetchRoom();
  }, [fetchAppointment, fetchRoom]);

  // Update the form data
  useEffect(() => {
    if (entity !== null) {
      setFormData({
        name: entity.appointment?.name,
        personal_number: entity.appointment?.personalNumber,
        time: entity.appointment?.time
          ? new Date(entity.appointment.time).toISOString().split("T")[0]
          : "",
        description: entity.appointment?.description,
        room_id: entity.room?.id,
      });
    }
  }, [entity]);

  // Update form data state by setting the value
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitButtonRef = useRef();

  // Function to handle the key press event
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      submitButtonRef.current.click();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [submitButtonRef]);

  // Render the spinner while loading
  if (!entity) {
    return <Loader />;
  }

  return (
    <div className="container">
      <h2 className="text-center mt-5 mb-3">Edit Appointment</h2>

      <div className="card">
        <div className="card-header">
          <BackButton />
        </div>

        <div className="card-body">
          <ErrorAlert errors={errorsBag} />

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
            ref={submitButtonRef}
            isSaving={isSaving}
            submit={() => updateRecord(uuid)}
            text="Update"
          />
        </div>
      </div>
    </div>
  );
}

export default observer(EditAppointment);
