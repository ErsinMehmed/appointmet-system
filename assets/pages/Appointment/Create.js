import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";

import BackButton from "../../components/BackButton";
import ErrorAlert from "../../components/ErrorAlert";
import Input from "../../components/Input";
import Select from "../../components/Select";
import SubmitButton from "../../components/SubmitButton";
import Textarea from "../../components/Textarea";
import AppointmentAction from "../../actions/Appointment";

function AddAppointment() {
  const {
    formData,
    isSaving,
    errorsBag,
    room,
    setFormData,
    fetchRoom,
    saveRecord,
  } = AppointmentAction;

  useEffect(() => {
    setFormData({
      name: "",
      personal_number: null,
      time: "",
      description: "",
      room_id: null,
    });

    fetchRoom();
  }, [setFormData, fetchRoom]);

  // Update form data state by setting the value
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="container">
      <h2 className="text-center mt-5 mb-3">Add Appointment</h2>

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
            text="Room"
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

          <SubmitButton isSaving={isSaving} submit={saveRecord} text="Save" />
        </div>
      </div>
    </div>
  );
}

export default observer(AddAppointment);
