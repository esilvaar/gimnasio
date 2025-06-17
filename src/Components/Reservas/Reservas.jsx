import React, { useState, useEffect } from 'react';
import './Reservas.css';

const horarios = [
  { id: 1, hora: '06:00', capacidad: 15 },
  { id: 2, hora: '07:00', capacidad: 20 },
  { id: 3, hora: '08:00', capacidad: 25 },
  { id: 4, hora: '09:00', capacidad: 20 },
  { id: 5, hora: '10:00', capacidad: 15 },
  { id: 6, hora: '17:00', capacidad: 30 },
  { id: 7, hora: '18:00', capacidad: 35 },
  { id: 8, hora: '19:00', capacidad: 30 },
  { id: 9, hora: '20:00', capacidad: 25 },
  { id: 10, hora: '21:00', capacidad: 20 }
];

const Reservas = ({ userType, currentUser }) => {
  const [reservas, setReservas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    cargarDatos();
    // Establecer fecha de hoy por defecto
    const hoy = new Date().toISOString().split('T')[0];
    setFechaSeleccionada(hoy);
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const resReservas = await fetch('https://6840f643d48516d1d359d997.mockapi.io/reservas');
      const dataReservas = await resReservas.json();
      
      const resUsuarios = await fetch('https://6840f643d48516d1d359d997.mockapi.io/user');
      const dataUsuarios = await resUsuarios.json();
      
      setReservas(dataReservas || []);
      setUsuarios(dataUsuarios || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setReservas([]);
      setUsuarios([]);
    }
    setLoading(false);
  };

  const realizarReserva = async (horarioId, hora) => {
    if (!currentUser || !fechaSeleccionada) return;

    // Verificar si ya tiene reserva en este horario y fecha
    const yaReservado = reservas.find(
      r => r.userId === currentUser.id && 
           r.fecha === fechaSeleccionada && 
           r.horarioId === horarioId
    );

    if (yaReservado) {
      alert('Ya tienes una reserva en este horario');
      return;
    }

    // Contar reservas existentes para este horario y fecha
    const reservasHorario = reservas.filter(
      r => r.horarioId === horarioId && r.fecha === fechaSeleccionada
    );

    const horario = horarios.find(h => h.id === horarioId);
    if (reservasHorario.length >= horario.capacidad) {
      alert('No hay cupos disponibles en este horario');
      return;
    }

    try {
      const nuevaReserva = {
        userId: currentUser.id,
        userName: currentUser.name,
        horarioId: horarioId,
        hora: hora,
        fecha: fechaSeleccionada,
        estado: 'confirmada'
      };

      const response = await fetch('https://6840f643d48516d1d359d997.mockapi.io/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaReserva)
      });

      if (response.ok) {
        const reservaCreada = await response.json();
        setReservas([...reservas, reservaCreada]);
        alert('Reserva realizada correctamente');
      }
    } catch (error) {
      console.error('Error al realizar reserva:', error);
      alert('Error al realizar la reserva');
    }
  };

  const cancelarReserva = async (reservaId) => {
    try {
      const response = await fetch(`https://6840f643d48516d1d359d997.mockapi.io/reservas/${reservaId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setReservas(reservas.filter(r => r.id !== reservaId));
        alert('Reserva cancelada');
      }
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      alert('Error al cancelar la reserva');
    }
  };

  const obtenerReservasHorario = (horarioId) => {
    return reservas.filter(
      r => r.horarioId === horarioId && r.fecha === fechaSeleccionada
    );
  };

  const usuarioTieneReserva = (horarioId) => {
    return reservas.some(
      r => r.userId === currentUser?.id && 
           r.horarioId === horarioId && 
           r.fecha === fechaSeleccionada
    );
  };

  const misReservas = reservas.filter(r => r.userId === currentUser?.id);

  if (loading) return <div className="loading">Cargando reservas...</div>;

  return (
    <div className="reservas-container">
      <h2>Sistema de Reservas</h2>
      
      <div className="fecha-selector">
        <label htmlFor="fecha">Seleccionar fecha:</label>
        <input
          type="date"
          id="fecha"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {fechaSeleccionada && (
        <div className="horarios-grid">
          <h3>Horarios disponibles para {fechaSeleccionada}</h3>
          <div className="horarios-lista">
            {horarios.map((horario) => {
              const reservasHorario = obtenerReservasHorario(horario.id);
              const cuposDisponibles = horario.capacidad - reservasHorario.length;
              const tieneReserva = usuarioTieneReserva(horario.id);
              
              return (
                <div key={horario.id} className="horario-card">
                  <div className="horario-info">
                    <h4>{horario.hora}</h4>
                    <p>Cupos: {cuposDisponibles}/{horario.capacidad}</p>
                    <div className="cupos-visual">
                      <div 
                        className="cupos-ocupados" 
                        style={{width: `${(reservasHorario.length / horario.capacidad) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  {userType === 'user' && (
                    <div className="horario-acciones">
                      {tieneReserva ? (
                        <span className="ya-reservado">✓ Reservado</span>
                      ) : cuposDisponibles > 0 ? (
                        <button 
                          className="btn-reservar"
                          onClick={() => realizarReserva(horario.id, horario.hora)}
                        >
                          Reservar
                        </button>
                      ) : (
                        <span className="sin-cupos">Sin cupos</span>
                      )}
                    </div>
                  )}

                  {userType === 'manager' && reservasHorario.length > 0 && (
                    <div className="usuarios-reservados">
                      <h5>Usuarios reservados:</h5>
                      <ul>
                        {reservasHorario.map((reserva) => (
                          <li key={reserva.id}>
                            {reserva.userName}
                            <button 
                              className="btn-cancelar-admin"
                              onClick={() => cancelarReserva(reserva.id)}
                            >
                              Cancelar
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {userType === 'user' && misReservas.length > 0 && (
        <div className="mis-reservas">
          <h3>Mis Reservas</h3>
          <div className="reservas-lista">
            {misReservas.map((reserva) => (
              <div key={reserva.id} className="reserva-item">
                <div className="reserva-info">
                  <span className="fecha">{reserva.fecha}</span>
                  <span className="hora">{reserva.hora}</span>
                  <span className={`estado ${reserva.estado}`}>{reserva.estado}</span>
                </div>
                <button 
                  className="btn-cancelar"
                  onClick={() => cancelarReserva(reserva.id)}
                >
                  Cancelar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservas;