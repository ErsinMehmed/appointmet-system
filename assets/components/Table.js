import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils";

const Table = (props) => {
  return (
    <table className="table table-striped table-hover table-bordered">
      <thead className="thead-dark">
        <tr>
          {props.columns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {!props.data.entity?.length ? (
          <tr>
            <td className="text-center py-3" colSpan={props.columns.length + 1}>
              No data found.
            </td>
          </tr>
        ) : (
          props.data.entity.map((row, index) => (
            <tr key={index}>
              {Object.entries(row).map(([key, value], index) => {
                if (key === "name") {
                  return (
                    <td key={index}>
                      <Link
                        className="text-primary"
                        to={`/appointments/show/${row.uuid}`}
                      >
                        {value}
                      </Link>
                    </td>
                  );
                }

                if (key === "room") {
                  value = value.number;
                }

                if (key === "time") {
                  value = formatDate(value);
                }

                return key !== "uuid" && <td key={index}>{value}</td>;
              })}
              <td>
                <Link
                  className="btn btn-success mx-1"
                  to={`/appointments/edit/${row.uuid}`}
                >
                  Edit
                </Link>

                <button
                  onClick={() => props.deleteRecord(row.uuid)}
                  className="btn btn-danger mx-1"
                >
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
