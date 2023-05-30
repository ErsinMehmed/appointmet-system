import React from "react";
import { Link } from "react-router-dom";

const Table = (props) => {
  function formatDate(date) {
    const dateTime = new Date(date.timestamp * 1000);
    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
    const day = dateTime.getDate().toString().padStart(2, "0");
    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  return (
    <table className='table table-striped table-hover table-bordered'>
      <thead className='thead-dark'>
        <tr>
          {props.columns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {!props.data.length ? (
          <tr>
            <td
              className='text-center'
              colSpan={props.columns.length + 1}>
              No data found.
            </td>
          </tr>
        ) : (
          props.data.map((row, index) => (
            <tr key={index}>
              {Object.entries(row).map(([key, value], index) => {
                if (key === "name") {
                  return (
                    <td key={index}>
                      <Link
                        className='text-primary'
                        to={`/appointments/show/${row.uuid}`}>
                        {value}
                      </Link>
                    </td>
                  );
                }

                if (key === "time") {
                  value = formatDate(value);
                }

                return key !== "uuid" && <td key={index}>{value}</td>;
              })}
              <td>
                <Link
                  className='btn btn-success mx-1'
                  to={`/appointments/edit/${row.uuid}`}>
                  Edit
                </Link>

                <button
                  onClick={() => props.deleteRecord(row.uuid)}
                  className='btn btn-danger mx-1'>
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default Table;
