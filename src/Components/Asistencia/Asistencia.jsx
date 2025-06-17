import React, { useState } from 'react';
// No import './Asistencia.css';
export default function Asistencia({ currentUser, userType }) {
    const [registros, setRegistros] = useState([
        { id: 1, userId: 2, userName: 'Ana', fecha: '2025-06-01', hora: '08:00', estado: 'presente' },
    ]);

    const registrar = () => {
        const date = new Date().toISOString().split('T')[0];
        const time = new Date().toLocaleTimeString();
        setRegistros([...registros, {
            id: Date.now(), userId: currentUser.id,
            userName: currentUser.name,
            fecha: date, hora: time,
            estado: 'presente'
        }]);
    };

    const eliminar = id => {
        setRegistros(registros.filter(r => r.id !== id));
    };

    const filtradas = registros.filter(r =>
        userType === 'manager' || r.userId === currentUser.id
    );

    return (
        <div className="container mt-4">
            <h2>Asistencia</h2>
            {userType === 'user' && (
                <button className="btn btn-primary mb-3" onClick={registrar}>
                    Registrar mi asistencia
                </button>
            )}
            <table className="table table-striped table-bordered">
                <thead className="table-dark">
                    <tr>
                        {userType === 'manager' && <th>Usuario</th>}
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Estado</th>
                        {userType === 'manager' && <th>Acción</th>}
                    </tr>
                </thead>
                <tbody>
                    {filtradas.map(r => (
                        <tr key={r.id}>
                            {userType === 'manager' && <td>{r.userName}</td>}
                            <td>{r.fecha}</td>
                            <td>{r.hora}</td>
                            <td>{r.estado}</td>
                            {userType === 'manager' && (
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => eliminar(r.id)}>
                                        Eliminar
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
