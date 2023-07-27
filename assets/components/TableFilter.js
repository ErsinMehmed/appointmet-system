import React from "react";

import Select from "./Select";
import Input from "./Input";

const TableFilter = (props) => {
  return (
    <div className="form-row mb-3">
      {props.appointmentTable && (
        <Input
          label="From:"
          value={props.dateFrom}
          onChange={(event) => props.setDateFrom(event)}
          type="date"
          id="dateFrom"
          name="dateFrom"
        />
      )}

      {props.appointmentTable && (
        <Input
          label="To:"
          value={props.dateTo}
          onChange={(event) => props.setDateTo(event)}
          type="date"
          id="dateTo"
          name="dateTo"
        />
      )}

      {(props.roomTable || props.appointmentTable) && (
        <Input
          label="Name:"
          value={props.name}
          onChange={(event) => props.setName(event)}
          type="text"
          id="name"
          name="name"
        />
      )}

      {props.roomTable && (
        <Input
          label="Room number:"
          value={props.roomNumber}
          onChange={(event) => props.setRoomNumber(event)}
          type="text"
          id="room-number"
          name="room-number"
        />
      )}

      {props.appointmentTable && (
        <Input
          label="Personal Number:"
          value={props.personalNumber}
          onChange={(event) => props.setPersonalNumber(event)}
          type="text"
          id="personalNumber"
          name="personalNumber"
        />
      )}

      {(props.roomTable || props.appointmentTable) && (
        <Select
          label="Records Per Page:"
          value={props.perPage}
          onChange={(event) => props.setPerPage(event)}
          id="perPage"
          options={[5, 10, 15, 20]}
        />
      )}
    </div>
  );
};

export default TableFilter;
