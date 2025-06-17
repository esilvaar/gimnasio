import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Calendario from "../Calendario/Calendario";
import Asistencia from "../Asistencia/Asistencia";
import Reservas from "../Reservas/Reservas";
import Rutinas from "../Rutinas/Rutinas";

function Mannager() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    id: 99,
    name: "Admin",
    type: "mannager",
  };

  return (
    <>
      <Navbar role="mannager" />
      <Routes>
        <Route path="/calendario" element={<Calendario />} />
        <Route
          path="/asistencia"
          element={<Asistencia userType="mannager" currentUser={currentUser} />}
        />
        <Route
          path="/reservas"
          element={<Reservas userType="mannager" currentUser={currentUser} />}
        />
        <Route
          path="/rutinas"
          element={<Rutinas userType="mannager" currentUser={currentUser} />}
        />
        <Route path="*" element={<Navigate to="/calendario" />} />
      </Routes>
    </>
  );
}
export default Mannager;