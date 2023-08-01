import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import TableFilter from "../../components/TableFilter";
import RoomAction from "../../actions/Room";

function IndexRoom() {
  const {
    entities,
    name,
    roomNumber,
    perPage,
    loadRooms,
    deleteRecord,
    handlePageClick,
    setName,
    setRoomNumber,
    setPerPage,
    handlePageChange,
  } = RoomAction;

  // Fetch the appointment list upon component mount
  useEffect(() => {
    loadRooms();
  }, []);

  return (
    <div style={{ background: "#ebf1f2" }}>
      <div className="container pb-2">
        <h2 className="text-center pt-5 mb-3">Room</h2>

        <div className="card">
          <div className="card-header d-flex justify-content-end gap-2">
            <Link className="btn btn-primary mt-2 mb-2" to="/">
              Go to Appointment Table
            </Link>

            <Link className="btn btn-primary mt-2 mb-2" to="/rooms/create">
              Add Room
            </Link>
          </div>

          <div className="card-body">
            <TableFilter
              name={name}
              roomNumber={roomNumber}
              setName={setName}
              setRoomNumber={setRoomNumber}
              perPage={perPage}
              setPerPage={setPerPage}
              roomTable={true}
            />

            <Table
              columns={["№", "Name", "Room number", "Action"]}
              data={entities}
              deleteRecord={deleteRecord}
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

export default observer(IndexRoom);
