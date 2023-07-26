import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateAppointment from "./pages/Appointment/Create";
import CreateRoom from "./pages/Room/Create";
import EditAppointment from "./pages/Appointment/Edit";
import IndexAppointment from "./pages/Appointment/Index";
import ShowAppointment from "./pages/Appointment/Show";

function Main() {
  return (
    <Routes>
      <Route path="/" element={<IndexAppointment />} />
      <Route path="/appointments/create" element={<CreateAppointment />} />
      <Route path="/appointments/edit/:id" element={<EditAppointment />} />
      <Route path="/appointments/show/:id" element={<ShowAppointment />} />

      <Route path="/rooms/create" element={<CreateRoom />} />
    </Routes>
  );
}

export default Main;
