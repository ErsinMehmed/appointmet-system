import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import { message } from "../utils";
import Pagination from "../components/Pagination";
import Table from "../components/Table";
import TableFilter from "../components/TableFilter";
import { path } from "../config";

function ShowAppointment() {
  const [entity, setEntity] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [name, setName] = useState("");
  const [personalNumber, setPersonalNumber] = useState("");
  const [perPage, setPerPage] = useState(10);

  // Fetch the appointment list upon component mount
  useEffect(() => {
    fetchAppointmentList();
  }, []);

  // Retrieve the first page of results after applying the data set filter
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFrom, dateTo, name, personalNumber]);

  // Fetch all data from controller
  const fetchAppointmentList = () => {
    axios
      .get(`${path}/api/appointments`)
      .then(function (response) {
        setEntity(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // Delete record
  const deleteRecord = (uuid) => {
    Swal.fire({
      title: "Are you sure you want to delete this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${path}/api/appointments/${uuid}`)
          .then(function (response) {
            message(
              "success",
              "Appointment has been deleted successfully!",
              false,
              false,
              1000
            );
            fetchAppointmentList();
          })
          .catch(function (error) {
            message("error", "Oops, Something went wrong!", false, false, 1000);
          });
      }
    });
  };

  // Data filter based on date range, name, and personal number.
  const filterAppointments = (appointments) => {
    const filteredAppointments = appointments.filter((appointment) => {
      const date = new Date(appointment.time);
      const filterFromDate = dateFrom ? new Date(dateFrom) : null;
      const filterToDate = dateTo ? new Date(dateTo) : null;
      const clientName = appointment.name
        .toLowerCase()
        .includes(name.toLowerCase());
      const appointmentPersonalNumber =
        appointment.personalNumber.includes(personalNumber);

      if (filterFromDate && date < filterFromDate) {
        return false;
      }

      if (filterToDate && date > filterToDate) {
        return false;
      }

      if (personalNumber && !appointmentPersonalNumber) {
        return false;
      }

      if (name && !clientName) {
        return false;
      }

      return true;
    });

    return filteredAppointments;
  };

  // Perform pagination calculation
  const lastAppointment = currentPage * perPage;
  const firstAppointment = lastAppointment - perPage;
  const filteredAppointments = filterAppointments(entity);
  const appointments = filteredAppointments.slice(
    firstAppointment,
    lastAppointment
  );
  const totalPages = Math.ceil(filteredAppointments.length / perPage);

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle prev page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className='container'>
      <h2 className='text-center mt-5 mb-3'>Appointment</h2>

      <div className='card'>
        <div className='card-header'>
          <Link
            className='btn btn-primary mt-2 mb-2'
            to='/appointments/create'>
            Add Appointment
          </Link>
        </div>

        <div className='card-body'>
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

export default ShowAppointment;
