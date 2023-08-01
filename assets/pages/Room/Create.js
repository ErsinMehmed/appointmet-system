import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";

import BackButton from "../../components/BackButton";
import ErrorAlert from "../../components/ErrorAlert";
import Input from "../../components/Input";
import SubmitButton from "../../components/SubmitButton";
import RoomAction from "../../actions/Room";

function AddRoom() {
  const { formData, isSaving, errorsBag, setFormData, saveRecord } = RoomAction;

  useEffect(() => {
    setFormData({
      name: "",
      number: null,
    });
  }, [setFormData]);

  // Update form data state by setting the value
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="container">
      <h2 className="text-center mt-5 mb-3">Add Room</h2>

      <div className="card">
        <div className="card-header">
          <BackButton text={"Rooms"} link={"/rooms"} />
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
            label="Room number"
            value={formData.number}
            type="text"
            id="number"
            name="number"
            onChange={(value) => handleInputChange("number", value)}
            errors={errorsBag}
          />

          <SubmitButton isSaving={isSaving} submit={saveRecord} text="Save" />
        </div>
      </div>
    </div>
  );
}

export default observer(AddRoom);
