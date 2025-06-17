import "./Navbar.css";

const navItems = {
    user: [
        { name: "Calendario", path: "/" },
        { name: "Rutinas", path: "/rutinas" },
        { name: "Perfil", path: "/perfil" },
    ],
    manager: [
        { name: "Calendario", path: "/" },
        { name: "Usuarios", path: "/usuarios" },
        { name: "Reportes", path: "/reportes" },
        { name: "Configuración", path: "/configuracion" },
    ],
};

export default function Navbar({ role = "user", onNavigate }) {
    const items = navItems[role] || navItems.user;

    return (
        <nav className="navbar">
            <div className="navbar-logo">Gimnasio</div>
            <ul className="navbar-list">
                {items.map((item) => (
                    <li key={item.path} className="navbar-item">
                        <button
                            className="navbar-button"
                            onClick={() => onNavigate && onNavigate(item.path)}
                        >
                            {item.name}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

/* Elimina el objeto styles y los props style en el componente.
    No necesitas agregar nada aquí, solo asegúrate de quitar los estilos inline en el JSX.
*/