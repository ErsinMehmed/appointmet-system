import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import TableFilter from "../../components/TableFilter";
import AppointmentAction from "../../actions/Appointment";

function IndexAppointment() {
  const {
    entities,
    dateFrom,
    dateTo,
    personalNumber,
    name,
    perPage,
    loadAppointments,
    deleteRecord,
    setDateTo,
    setDateFrom,
    setPersonalNumber,
    handlePageClick,
    setName,
    setPerPage,
    handlePageChange,
  } = AppointmentAction;

  // Fetch the appointment list upon component mount
  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <div style={{ background: "#ebf1f2" }}>
      <div className="container pb-2">
        <h2 className="text-center pt-5 mb-3">Appointment</h2>

        <div className="card">
          <div className="card-header d-flex justify-content-end gap-2">
            <Link className="btn btn-primary mt-2 mb-2" to="/rooms">
              Go to Room Table
            </Link>

            <Link
              className="btn btn-primary mt-2 mb-2"
              to="/appointments/create"
            >
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
              appointmentTable={true}
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
              data={entities}
              deleteRecord={deleteRecord}
              appointment={true}
            />

            {entities.pagination?.total_pages > 1 && (
              <Pagination
                currentPage={entities.pagination?.current_page}
                totalPages={entities.pagination?.total_pages}
                totalItems={entities.pagination?.total_items}
                perPage={perPage}
                handlePrevPage={handlePageChange}
                handleNextPage={() => handlePageChange("next")}
                handlePageClick={(pageNumber) => {
                  handlePageClick(pageNumber);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(IndexAppointment);
