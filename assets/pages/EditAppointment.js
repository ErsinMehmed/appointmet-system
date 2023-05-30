import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { validateFields, message } from "../Function";
import BackButton from "../components/BackButton";
import ErrorAlert from "../components/ErrorAlert";
import Input from "../components/Input";
import Loader from "../components/Loader";
import SubmitButton from "../components/SubmitButton";
import Textarea from "../components/Textarea";

function EditAppointment() {
  const [uuid, setUuid] = useState(useParams().id);
  const [appointment, setAppointment] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorsBag, setErrorsBag] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    personal_number: "",
    time: "",
    description: "",
  });

  // Fetch all data from controller
  useEffect(() => {
    fetchAppointmentList();
  }, []);

  // Update the form data
  useEffect(() => {
    if (appointment !== null) {
      setFormData({
        name: appointment.name,
        personal_number: appointment.personalNumber,
        time: appointment.time
          ? new Date(appointment.time.timestamp * 1000)
              .toISOString()
              .split("T")[0]
          : "",
        description: appointment.description,
      });
    }
  }, [appointment]);

  // Get all data from controller
  const fetchAppointmentList = () => {
    axios
      .get(`/appointments/edit/${uuid}`)
      .then(function (response) {
        setAppointment(response.data);
      })
      .catch(function (error) {
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
    validateFields(
      formData.name,
      formData.personal_number,
      formData.time,
      formData.description
    );

    const data = {
      name: formData.name,
      personal_number: formData.personal_number,
      time: formData.time,
      description: formData.description,
    };

    // Send a PUT request to update form data.
    axios
      .put(`/appointments/${uuid}`, data)
      .then(function (response) {
        message("success", "Appointment has been updated successfully!", true);
        fetchAppointmentList();
        setFormData({
          name: appointment.name,
          personal_number: appointment.personal_number,
          time: appointment.time
            ? new Date(appointment.time).toISOString().split("T")[0]
            : "",
          description: appointment.description,
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

  // Render the spinner while loading
  if (!appointment) {
    return <Loader />;
  }

  return (
    <div className='container'>
      <h2 className='text-center mt-5 mb-3'>Add Appointment</h2>

      <div className='card'>
        <div className='card-header'>
          <BackButton />
        </div>

        <div className='card-body'>
          <ErrorAlert errorsBag={errorsBag} />

          <form>
            <Input
              label='Name'
              for='name'
              value={formData.name}
              type='text'
              id='name'
              name='name'
              onChange={(value) => handleInputChange("name", value)}
            />

            <Input
              label='Personal Number'
              for='personal-number'
              value={formData.personal_number}
              type='text'
              id='personal-number'
              name='personalNumber'
              maxLength='10'
              onChange={(value) => handleInputChange("personal_number", value)}
            />

            <Input
              label='Choice date'
              for='date'
              value={formData.time}
              type='date'
              id='date'
              name='date'
              onChange={(value) => handleInputChange("time", value)}
            />

            <Textarea
              label='Description'
              for='description'
              value={formData.description}
              id='description'
              name='description'
              onChange={(value) => handleInputChange("description", value)}
            />

            <SubmitButton
              isSaving={isSaving}
              submit={updateRecord}
              text='Update'
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditAppointment;
