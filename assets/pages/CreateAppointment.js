import React, { useState, useEffect } from "react";
import axios from "axios";

import { message } from "../utils";
import { validateFields } from "../validations";
import { rules } from "../rules/appointmentFormRules";
import { path } from "../config";

import BackButton from "../components/BackButton";
import ErrorAlert from "../components/ErrorAlert";
import Input from "../components/Input";
import Select from "../components/Select";
import SubmitButton from "../components/SubmitButton";
import Textarea from "../components/Textarea";

function AddAppointment() {
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

  // Update the form data
  useEffect(() => {
    setFormData({
      name: "",
      personal_number: null,
      time: "",
      description: "",
      room_id: null,
    });

    fetchRoom();
  }, []);

  console.log(formData);

  // Update form data state by setting the value
  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fetch all room data from controller
  const fetchRoom = () => {
    axios
      .get(`${path}/api/rooms`)
      .then(function (response) {
        setRoom(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // Create
  const saveRecord = () => {
    setIsSaving(true);
    const data = new FormData();

    // Perform validation for all fields.
    const errors = validateFields(formData, rules);

    if(Object.keys(errors).length) {
      setErrorsBag(errors);
      setIsSaving(false);
      return;
    }

    data.append("name", formData.name);
    data.append("personal_number", formData.personal_number);
    data.append("time", formData.time);
    data.append("description", formData.description);
    data.append("room_id", formData.room_id);

    // Send a POST request to create record.
    axios
      .post(`${path}/api/appointments`, data)
      .then(function () {
        message("success", "Appointment has been added successfully!", true);
        setIsSaving(false);
        setFormData({
          name: "",
          personal_number: null,
          time: "",
          description: "",
          room_id: null,
        });
        setErrorsBag([]);
        setIsSaving(false);
      })
      .catch(function (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.length > 0
        ) {
          setErrorsBag(error.response.data);
        } else {
          setErrorsBag(["Oops, something went wrong!"]);
        }
        setIsSaving(false);
      });
  };

  return (
    <div className='container'>
      <h2 className='text-center mt-5 mb-3'>Add Appointment</h2>

      <div className='card'>
        <div className='card-header'>
          <BackButton />
        </div>

        <div className='card-body'>
          <ErrorAlert errors={errorsBag} />

          <form>
            <Input
              label='Name'
              value={formData.name}
              type='text'
              id='name'
              name='name'
              onChange={(value) => handleInputChange("name", value)}
              errors={errorsBag}
            />

            <Input
              label='Personal Number'
              value={formData.personal_number}
              type='text'
              id='personal-number'
              name='personal_number'
              maxLength='10'
              onChange={(value) => handleInputChange("personal_number", value)}
              errors={errorsBag}
            />

            <Input
              label='Choice date'
              value={formData.time}
              type='date'
              id='date'
              name='time'
              onChange={(value) => handleInputChange("time", value)}
              errors={errorsBag}
            />

            <Select
              label="Choice room"
              value={formData.room_id}
              onChange={(value) => handleInputChange("room_id", value)}
              id="room"
              name='room_id'
              options={room}
              text="Room"
              errors={errorsBag}
            />

            <Textarea
              label='Description'
              value={formData.description}
              id='description'
              name='description'
              onChange={(value) => handleInputChange("description", value)}
              errors={errorsBag}
            />

            <SubmitButton
              isSaving={isSaving}
              submit={saveRecord}
              text='Save'
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAppointment;
