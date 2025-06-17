import React, { useState } from 'react';
const allRutinas = [
  { id: 1, nombre: 'Cardio 30m', tipo: 'Cardio' },
  { id: 2, nombre: 'Fuerza básica', tipo: 'Fuerza' },
];

export default function Rutinas({ currentUser, userType }) {
  const [asignaciones, setAsign] = useState([]);

  const asignar = id => {
    if (asignaciones.some(a => a.rutinaId === id)) return;
    const r = allRutinas.find(rt => rt.id === id);
    setAsign([...asignaciones, { id: Date.now(), rutinaId: id, ...r }]);
  };

  const desasignar = id => {
    setAsign(asignaciones.filter(a => a.id !== id));
  };

  return (
    <div>
      <h2>Rutinas</h2>
      {userType === 'manager' && (
        <ul>
          {allRutinas.map(r => (
            <li key={r.id}>{r.nombre} (<em>{r.tipo}</em>)</li>
          ))}
        </ul>
      )}
      {userType === 'user' && (
        <ul>
          {allRutinas.map(r => (
            <li key={r.id}>
              {r.nombre}
              {asignaciones.some(a => a.rutinaId === r.id) ? (
                <button onClick={() => desasignar(asignaciones.find(a => a.rutinaId === r.id).id)}>
                  Quitar
                </button>
              ) : (
                <button onClick={() => asignar(r.id)}>Asignar</button>
              )}
            </li>
          ))}
        </ul>
      )}

      {userType === 'user' && asignaciones.length > 0 && (
        <>
          <h3>Mis Rutinas</h3>
          <ul>
            {asignaciones.map(a => (
              <li key={a.id}>{a.nombre}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
