import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateAppointment from "./pages/CreateAppointment";
import EditAppointment from "./pages/EditAppointment";
import IndexAppointment from "./pages/IndexAppointment";
import ShowAppointment from "./pages/ShowAppointment";

function Main() {
  return (
    <Routes>
      <Route
        path='/'
        element={<IndexAppointment />}
      />
      <Route
        path='/appointments/create'
        element={<CreateAppointment />}
      />
      <Route
        path='/appointments/edit/:id'
        element={<EditAppointment />}
      />
      <Route
        path='/appointments/show/:id'
        element={<ShowAppointment />}
      />
    </Routes>
  );
}

export default Main;
