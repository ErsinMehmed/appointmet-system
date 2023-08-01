import React from "react";
import { Routes, Route } from "react-router-dom";

import CreateAppointment from "./pages/Appointment/Create";
import EditAppointment from "./pages/Appointment/Edit";
import IndexAppointment from "./pages/Appointment/Index";
import ShowAppointment from "./pages/Appointment/Show";

import CreateRoom from "./pages/Room/Create";
import EditRoom from "./pages/Room/Edit";
import IndexRoom from "./pages/Room/Index";

function Main() {
  return (
    <Routes>
      <Route path="/" element={<IndexAppointment />} />
      <Route path="/appointments/create" element={<CreateAppointment />} />
      <Route path="/appointments/edit/:id" element={<EditAppointment />} />
      <Route path="/appointments/show/:id" element={<ShowAppointment />} />

      <Route path="/rooms" element={<IndexRoom />} />
      <Route path="/rooms/create" element={<CreateRoom />} />
      <Route path="/rooms/edit/:id" element={<EditRoom />} />
    </Routes>
  );
}

export default Main;
