import React, { useState, useEffect } from "react";
import axios from "axios";

import { validateFields, message } from "../Function";
import BackButton from "../components/BackButton";
import ErrorAlert from "../components/ErrorAlert";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import Textarea from "../components/Textarea";

function AddAppointment() {
  const [isSaving, setIsSaving] = useState(false);
  const [errorsBag, setErrorsBag] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    personal_number: "",
    time: "",
    description: "",
  });

  // Update the form data
  useEffect(() => {
    setFormData({
      name: "",
      personal_number: "",
      time: "",
      description: "",
    });
  }, []);

  // Update form data state by setting the value
  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Update create
  const saveRecord = () => {
    setIsSaving(true);
    const data = new FormData();

    // Perform validation for all fields.
    validateFields(
      formData.name,
      formData.personal_number,
      formData.time,
      formData.description
    );

    data.append("name", formData.name);
    data.append("personal_number", formData.personal_number);
    data.append("time", formData.time);
    data.append("description", formData.description);

    // Send a PUT request to update form data.
    axios
      .post("/appointments", data)
      .then(function (response) {
        message("success", "Appointment has been added successfully!", true);
        setIsSaving(false);
        setFormData({
          name: "",
          personal_number: "",
          time: "",
          description: "",
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
