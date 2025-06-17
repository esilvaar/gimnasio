import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://6840f643d48516d1d359d997.mockapi.io/user"
      );
      const users = await res.json();
      const user = users.find(
        (u) => u.name === username && u.password === password
      );
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        if (user.type === "user") navigate("/user/calendario");
        else if (user.type === "mannager") navigate("/mannager/calendario");
        else alert("Tipo de usuario desconocido.");
      } else {
        alert("Usuario o contraseña incorrectos.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>INICIO SESION GIMNASIO</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};
export default LoginForm;