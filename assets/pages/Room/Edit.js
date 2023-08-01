import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";

import BackButton from "../../components/BackButton";
import ErrorAlert from "../../components/ErrorAlert";
import Input from "../../components/Input";
import Loader from "../../components/Loader";
import SubmitButton from "../../components/SubmitButton";
import RoomAction from "../../actions/Room";

function EditRoom() {
  const id = useParams().id;
  const {
    entity,
    formData,
    isSaving,
    errorsBag,
    setFormData,
    fetchRoom,
    updateRecord,
  } = RoomAction;

  // Fetch data
  useEffect(() => {
    fetchRoom(id);
  }, [fetchRoom]);

  // Update the form data
  useEffect(() => {
    if (entity !== null) {
      setFormData({
        name: entity.room?.name,
        number: entity.room?.number,
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

  // Render the spinner while loading
  if (!entity) {
    return <Loader />;
  }

  return (
    <div className="container">
      <h2 className="text-center mt-5 mb-3">Edit Room</h2>

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

          <SubmitButton
            isSaving={isSaving}
            submit={() => updateRecord(id)}
            text="Update"
          />
        </div>
      </div>
    </div>
  );
}

export default observer(EditRoom);
