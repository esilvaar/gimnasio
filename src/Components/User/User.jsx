import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Calendario from "../Calendario/Calendario";
import Reservas from "../Reservas/Reservas";
import Rutinas from "../Rutinas/Rutinas";

function User() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    id: 1,
    name: "Invitado",
    type: "user",
  };

  return (
    <>
      <Navbar role="user" />
      <Routes>
        <Route path="/calendario" element={<Calendario />} />
        <Route
          path="/reservas"
          element={<Reservas userType="user" currentUser={currentUser} />}
        />
        <Route
          path="/rutinas"
          element={<Rutinas userType="user" currentUser={currentUser} />}
        />
        <Route path="*" element={<Navigate to="/calendario" />} />
      </Routes>
    </>
  );
}
export default User;
