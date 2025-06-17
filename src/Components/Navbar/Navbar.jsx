import React from "react";
import { NavLink } from "react-router-dom";

const navItems = {
    user: [
        { name: "Calendario", path: "/user/calendario" },
        { name: "Reservas", path: "/user/reservas" },
        { name: "Rutinas", path: "/user/rutinas" },
    ],
    mannager: [
        { name: "Calendario", path: "/mannager/calendario" },
        { name: "Asistencia", path: "/mannager/asistencia" },
        { name: "Rutinas", path: "/mannager/rutinas" },
        { name: "Reservas", path: "/mannager/reservas" },
    ],
};

export default function Navbar({ role = "user" }) {
    const items = navItems[role] || navItems.user;
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top w-100">
            <div className="container-fluid">
                <span className="navbar-brand">Gimnasio</span>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {items.map((item) => (
                            <li key={item.path} className="nav-item">
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        isActive ? "nav-link active" : "nav-link"
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
