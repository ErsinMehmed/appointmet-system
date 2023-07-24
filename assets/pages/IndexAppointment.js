import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

import Pagination from "../components/Pagination";
import Table from "../components/Table";
import TableFilter from "../components/TableFilter";
import AppointmentAction from "../actions/Appointment";

function IndexAppointment() {
  const {
    entities,
    dateFrom,
    dateTo,
    personalNumber,
    currentPage,
    name,
    perPage,
    totalPages,
    fetchAllAppointments,
    deleteRecord,
    filterAppointments,
    setDateTo,
    setDateFrom,
    setPersonalNumber,
    setCurrentPage,
    setName,
    setPerPage,
    setTotalPages,
    handleNextPage,
    handlePrevPage,
  } = AppointmentAction;

  // Fetch the appointment list upon component mount
  useEffect(() => {
    fetchAllAppointments();
  }, []);

  // Retrieve the first page of results after applying the data set filter
  useEffect(() => {
    setCurrentPage(1);
  }, []);

  // Perform pagination calculation
  const lastAppointment = currentPage * perPage;
  const firstAppointment = lastAppointment - perPage;
  const filteredAppointments = filterAppointments(entities);
  setTotalPages(Math.ceil(filteredAppointments.length / perPage));
  const appointments = filteredAppointments.slice(
    firstAppointment,
    lastAppointment
  );

  return (
    <div className="container">
      <h2 className="text-center mt-5 mb-3">Appointment</h2>

      <div className="card">
        <div className="card-header">
          <Link className="btn btn-primary mt-2 mb-2" to="/appointments/create">
            Add Appointment
          </Link>
        </div>

        <div className="card-body">
          <TableFilter
            dateFrom={dateFrom}
            dateTo={dateTo}
            name={name}
            personalNumber={personalNumber}
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
            setName={setName}
            setPersonalNumber={setPersonalNumber}
            perPage={perPage}
            setPerPage={setPerPage}
          />

          <Table
            columns={[
              "№",
              "Name",
              "Personal number",
              "Time",
              "Description",
              "Room Number",
              "Action",
            ]}
            data={appointments}
            deleteRecord={deleteRecord}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
            handlePageClick={(pageNumber) => {
              setCurrentPage(pageNumber);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default observer(IndexAppointment);
