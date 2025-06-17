import React, { useState, useEffect } from 'react';
import './Rutinas.css';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const tiposRutina = [
  { id: 1, nombre: 'Cardio', color: '#ff6b6b' },
  { id: 2, nombre: 'Fuerza', color: '#4ecdc4' },
  { id: 3, nombre: 'Funcional', color: '#45b7d1' },
  { id: 4, nombre: 'Yoga', color: '#96ceb4' },
  { id: 5, nombre: 'CrossFit', color: '#feca57' },
  { id: 6, nombre: 'Pilates', color: '#ff9ff3' }
];

const Rutinas = ({ userType, currentUser }) => {
  const [rutinas, setRutinas] = useState([]);
  const [misRutinas, setMisRutinas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState('Lunes');
  const [nuevaRutina, setNuevaRutina] = useState({
    nombre: '',
    descripcion: '',
    tipo: '',
    duracion: '',
    instructor: '',
    horario: '',
    dia: 'Lunes',
    nivel: 'Principiante'
  });

  useEffect(() => {
    cargarRutinas();
    if (userType === 'user') {
      cargarMisRutinas();
    }
  }, [userType, currentUser]);

  const cargarRutinas = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://6840f643d48516d1d359d997.mockapi.io/rutinas');
      const data = await response.json();
      setRutinas(data || []);
    } catch (error) {
      console.error('Error al cargar rutinas:', error);
      setRutinas([]);
    }
    setLoading(false);
  };

  const cargarMisRutinas = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch('https://6840f643d48516d1d359d997.mockapi.io/mis-rutinas');
      const data = await response.json();
      const rutinasUsuario = data.filter(r => r.userId === currentUser.id);
      setMisRutinas(rutinasUsuario || []);
    } catch (error) {
      console.error('Error al cargar mis rutinas:', error);
      setMisRutinas([]);
    }
  };

  const crearRutina = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://6840f643d48516d1d359d997.mockapi.io/rutinas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaRutina)
      });

      if (response.ok) {
        const rutinaCreada = await response.json();
        setRutinas([...rutinas, rutinaCreada]);
        setNuevaRutina({
          nombre: '',
          descripcion: '',
          tipo: '',
          duracion: '',
          instructor: '',
          horario: '',
          dia: 'Lunes',
          nivel: 'Principiante'
        });
        setMostrarFormulario(false);
        alert('Rutina creada correctamente');
      }
    } catch (error) {
      console.error('Error al crear rutina:', error);
      alert('Error al crear la rutina');
    }
  };

  const eliminarRutina = async (id) => {
    try {
      const response = await fetch(`https://6840f643d48516d1d359d997.mockapi.io/rutinas/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setRutinas(rutinas.filter(r => r.id !== id));
        alert('Rutina eliminada');
      }
    } catch (error) {
      console.error('Error al eliminar rutina:', error);
      alert('Error al eliminar la rutina');
    }
  };

  const asignarRutina = async (rutinaId) => {
    if (!currentUser) return;

    // Verificar si ya tiene asignada esta rutina
    const yaAsignada = misRutinas.find(mr => mr.rutinaId === rutinaId);
    if (yaAsignada) {
      alert('Ya tienes esta rutina asignada');
      return;
    }

    try {
      const rutina = rutinas.find(r => r.id === rutinaId);
      const asignacion = {
        userId: currentUser.id,
        rutinaId: rutinaId,
        rutinaInfo: rutina,
        fechaAsignacion: new Date().toISOString().split('T')[0],
        progreso: 0,
        completada: false
      };

      const response = await fetch('https://6840f643d48516d1d359d997.mockapi.io/mis-rutinas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asignacion)
      });

      if (response.ok) {
        const asignacionCreada = await response.json();
        setMisRutinas([...misRutinas, asignacionCreada]);
        alert('Rutina asignada correctamente');
      }
    } catch (error) {
      console.error('Error al asignar rutina:', error);
      alert('Error al asignar la rutina');
    }
  };

  const desasignarRutina = async (id) => {
    try {
      const response = await fetch(`https://6840f643d48516d1d359d997.mockapi.io/mis-rutinas/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMisRutinas(misRutinas.filter(mr => mr.id !== id));
        alert('Rutina desasignada');
      }
    } catch (error) {
      console.error('Error al desasignar rutina:', error);
      alert('Error al desasignar la rutina');
    }
  };

  const marcarCompletada = async (id, completada) => {
    try {
      const response = await fetch(`https://6840f643d48516d1d359d997.mockapi.io/mis-rutinas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completada, progreso: completada ? 100 : 0 })
      });

      if (response.ok) {
        setMisRutinas(misRutinas.map(mr => 
          mr.id === id ? { ...mr, completada, progreso: completada ? 100 : 0 } : mr
        ));
      }
    } catch (error) {
      console.error('Error al actualizar rutina:', error);
      alert('Error al actualizar la rutina');
    }
  };

  const obtenerColorTipo = (tipo) => {
    const tipoObj = tiposRutina.find(t => t.nombre === tipo);
    return tipoObj ? tipoObj.color : '#gray';
  };

  const rutinasPorDia = rutinas.filter(r => r.dia === diaSeleccionado);

  if (loading) return <div className="loading">Cargando rutinas...</div>;

  return (
    <div className="rutinas-container">
      <h2>Sistema de Rutinas</h2>
      
      {userType === 'manager' && (
        <div className="admin-controles">
          <button 
            className="btn-crear-rutina"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {mostrarFormulario ? 'Cancelar' : 'Crear Nueva Rutina'}
          </button>
        </div>
      )}

      {mostrarFormulario && userType === 'manager' && (
        <div className="formulario-rutina">
          <h3>Crear Nueva Rutina</h3>
          <form onSubmit={crearRutina}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={nuevaRutina.nombre}
                  onChange={(e) => setNuevaRutina({...nuevaRutina, nombre: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Tipo:</label>
                <select
                  value={nuevaRutina.tipo}
                  onChange={(e) => setNuevaRutina({...nuevaRutina, tipo: e.target.value})}
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposRutina.map(tipo => (
                    <option key={tipo.id} value={tipo.nombre}>{tipo.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Día:</label>
                <select
                  value={nuevaRutina.dia}
                  onChange={(e) => setNuevaRutina({...nuevaRutina, dia: e.target.value})}
                  required
                >
                  {diasSemana.map(dia => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Horario:</label>
                <input
                  type="time"
                  value={nuevaRutina.horario}
                  onChange={(e) => setNuevaRutina({...nuevaRutina, horario: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Duración (minutos):</label>
                <input
                  type="number"
                  value={nuevaRutina.duracion}
                  onChange={(e) => setNuevaRutina({...nuevaRutina, duracion: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Instructor:</label>
                <input
                  type="text"
                  value={nuevaRutina.instructor}
                  onChange={(e) => setNuevaRutina({...nuevaRutina, instructor: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nivel:</label>
                <select
                  value={nuevaRutina.nivel}
                  onChange={(e) => setNuevaRutina({...nuevaRutina, nivel: e.target.value})}
                >
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Descripción:</label>
              <textarea
                value={nuevaRutina.descripcion}
                onChange={(e) => setNuevaRutina({...nuevaRutina, descripcion: e.target.value})}
                rows="3"
                required
              />
            </div>

            <button type="submit" className="btn-guardar">Crear Rutina</button>
          </form>
        </div>
      )}

      <div className="selector-dia">
        <label>Ver rutinas del día:</label>
        <div className="dias-botones">
          {diasSemana.map(dia => (
            <button
              key={dia}
              className={`btn-dia ${diaSeleccionado === dia ? 'activo' : ''}`}
              onClick={() => setDiaSeleccionado(dia)}
            >
              {dia}
            </button>
          ))}
        </div>
      </div>

      <div className="rutinas-disponibles">
        <h3>Rutinas disponibles - {diaSeleccionado}</h3>
        {rutinasPorDia.length === 0 ? (
          <p>No hay rutinas programadas para este día</p>
        ) : (
          <div className="rutinas-grid">
            {rutinasPorDia.map((rutina) => (
              <div key={rutina.id} className="rutina-card">
                <div 
                  className="rutina-tipo" 
                  style={{backgroundColor: obtenerColorTipo(rutina.tipo)}}
                >
                  {rutina.tipo}
                </div>
                <h4>{rutina.nombre}</h4>
                <p className="rutina-descripcion">{rutina.descripcion}</p>
                <div className="rutina-detalles">
                  <span>🕐 {rutina.horario}</span>
                  <span>⏱️ {rutina.duracion} min</span>
                  <span>👨‍🏫 {rutina.instructor}</span>
                  <span className={`nivel ${rutina.nivel.toLowerCase()}`}>
                    {rutina.nivel}
                  </span>
                </div>
                <div className="rutina-acciones">
                  {userType === 'user' && (
                    <button 
                      className="btn-asignar"
                      onClick={() => asignarRutina(rutina.id)}
                    >
                      Asignar a mi rutina
                    </button>
                  )}
                  {userType === 'manager' && (
                    <button 
                      className="btn-eliminar"
                      onClick={() => eliminarRutina(rutina.id)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {userType === 'user' && misRutinas.length > 0 && (
        <div className="mis-rutinas">
          <h3>Mis Rutinas Asignadas</h3>
          <div className="rutinas-grid">
            {misRutinas.map((miRutina) => (
              <div key={miRutina.id} className="mi-rutina-card">
                <div 
                  className="rutina-tipo" 
                  style={{backgroundColor: obtenerColorTipo(miRutina.rutinaInfo?.tipo)}}
                >
                  {miRutina.rutinaInfo?.tipo}
                </div>
                <h4>{miRutina.rutinaInfo?.nombre}</h4>
                <p>{miRutina.rutinaInfo?.descripcion}</p>
                <div className="rutina-detalles">
                  <span>📅 {miRutina.rutinaInfo?.dia}</span>
                  <span>🕐 {miRutina.rutinaInfo?.horario}</span>
                  <span>⏱️ {miRutina.rutinaInfo?.duracion} min</span>
                </div>
                <div className="progreso-rutina">
                  <div className="progreso-bar">
                    <div 
                      className="progreso-fill" 
                      style={{width: `${miRutina.progreso}%`}}
                    ></div>
                  </div>
                  <span>{miRutina.progreso}% completado</span>
                </div>
                <div className="rutina-acciones">
                  <button 
                    className={`btn-completar ${miRutina.completada ? 'completada' : ''}`}
                    onClick={() => marcarCompletada(miRutina.id, !miRutina.completada)}
                  >
                    {miRutina.completada ? '✓ Completada' : 'Marcar como completada'}
                  </button>
                  <button 
                    className="btn-desasignar"
                    onClick={() => desasignarRutina(miRutina.id)}
                  >
                    Desasignar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Rutinas;