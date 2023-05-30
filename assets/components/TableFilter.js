import React from "react";

import Select from "./Select";
import Input from "./Input";

const TableFilter = (props) => {
  return (
    <div className="form-row mb-3">
      <Input
        label="From:"
        value={props.dateFrom}
        onChange={(event) => props.setDateFrom(event)}
        type="date"
        id="dateFrom"
        name="dateFrom"
      />

      <Input
        label="To:"
        value={props.dateTo}
        onChange={(event) => props.setDateTo(event)}
        type="date"
        id="dateTo"
        name="dateTo"
      />

      <Input
        label="Client Name:"
        value={props.name}
        onChange={(event) => props.setName(event)}
        type="text"
        id="name"
        name="name"
      />

      <Input
        label="Personal Number:"
        value={props.personalNumber}
        onChange={(event) => props.setPersonalNumber(event)}
        type="text"
        id="personalNumber"
        name="personalNumber"
      />

      <Select
        label="Records Per Page:"
        value={props.perPage}
        onChange={(event) => props.setPerPage(event)}
        id="perPage"
        options={[5, 10, 20, 30, 50]}
      />
    </div>
  );
};

export default TableFilter;
