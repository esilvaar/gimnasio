import React, { useState } from 'react';

const slotTimes = ['06:00', '07:00', '08:00', '17:00', '18:00'];

export default function Reservas({ currentUser, userType }) {
  const [reservas, set] = useState([]);

  const reservar = hora => {
    set([...reservas, {
      id: Date.now(), userId: currentUser.id,
      userName: currentUser.name, fecha: '2025-06-17',
      hora, estado: 'confirmada'
    }]);
  };

  const cancelar = id => set(reservas.filter(r => r.id !== id));

  return (
    <div>
      <h2>Reservas</h2>
      <div>
        {slotTimes.map(h => (
          <div key={h}>
            <span>{h}</span>
            {reservas.some(r=> r.userId===currentUser.id && r.hora===h) ?
              <button onClick={() => cancelar(reservas.find(r=> r.hora===h).id)}>
                Cancelar
              </button> :
              <button onClick={() => reservar(h)}>Reservar</button>}
          </div>
        ))}
      </div>
      {userType === 'manager' && (
        <div>
          <h3>Todas las reservas</h3>
          <ul>
            {reservas.map(r => (
              <li key={r.id}>
                {r.userName} - {r.hora}
                <button onClick={() => cancelar(r.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
