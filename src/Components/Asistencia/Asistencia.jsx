import React, { useState, useEffect } from 'react';
import './Asistencia.css';

const Asistencia = ({ userType, currentUser }) => {
  const [asistencias, setAsistencias] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar asistencias
      const resAsistencias = await fetch('https://6840f643d48516d1d359d997.mockapi.io/asistencias');
      const dataAsistencias = await resAsistencias.json();
      
      // Cargar usuarios para nombres
      const resUsuarios = await fetch('https://6840f643d48516d1d359d997.mockapi.io/user');
      const dataUsuarios = await resUsuarios.json();
      
      setAsistencias(dataAsistencias || []);
      setUsuarios(dataUsuarios || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setAsistencias([]);
      setUsuarios([]);
    }
    setLoading(false);
  };

  const registrarAsistencia = async () => {
    if (!currentUser) return;
    
    const hoy = new Date().toISOString().split('T')[0];
    const ahora = new Date().toLocaleTimeString();
    
    // Verificar si ya registró asistencia hoy
    const yaRegistrado = asistencias.find(
      a => a.userId === currentUser.id && a.fecha === hoy
    );
    
    if (yaRegistrado) {
      alert('Ya registraste tu asistencia hoy');
      return;
    }

    try {
      const nuevaAsistencia = {
        userId: currentUser.id,
        userName: currentUser.name,
        fecha: hoy,
        hora: ahora,
        estado: 'presente'
      };

      const response = await fetch('https://6840f643d48516d1d359d997.mockapi.io/asistencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaAsistencia)
      });

      if (response.ok) {
        const asistenciaCreada = await response.json();
        setAsistencias([...asistencias, asistenciaCreada]);
        alert('Asistencia registrada correctamente');
      }
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
      alert('Error al registrar asistencia');
    }
  };

  const eliminarAsistencia = async (id) => {
    try {
      const response = await fetch(`https://6840f643d48516d1d359d997.mockapi.io/asistencias/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAsistencias(asistencias.filter(a => a.id !== id));
        alert('Asistencia eliminada');
      }
    } catch (error) {
      console.error('Error al eliminar asistencia:', error);
      alert('Error al eliminar asistencia');
    }
  };

  const obtenerNombreUsuario = (userId) => {
    const usuario = usuarios.find(u => u.id === userId);
    return usuario ? usuario.name : 'Usuario desconocido';
  };

  const asistenciasFiltradas = asistencias.filter(asistencia => {
    const cumpleFecha = !filtroFecha || asistencia.fecha === filtroFecha;
    const cumpleUsuario = userType === 'manager' || asistencia.userId === currentUser?.id;
    return cumpleFecha && cumpleUsuario;
  });

  if (loading) return <div className="loading">Cargando asistencias...</div>;

  return (
    <div className="asistencia-container">
      <h2>Control de Asistencia</h2>
      
      {userType === 'user' && (
        <div className="registro-asistencia">
          <button 
            className="btn-registrar"
            onClick={registrarAsistencia}
          >
            Registrar Mi Asistencia
          </button>
        </div>
      )}

      <div className="filtros">
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
          placeholder="Filtrar por fecha"
        />
        <button onClick={() => setFiltroFecha('')}>Limpiar Filtro</button>
      </div>

      <div className="asistencias-lista">
        {asistenciasFiltradas.length === 0 ? (
          <p>No hay registros de asistencia</p>
        ) : (
          <table className="tabla-asistencias">
            <thead>
              <tr>
                {userType === 'manager' && <th>Usuario</th>}
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
                {userType === 'manager' && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {asistenciasFiltradas.map((asistencia) => (
                <tr key={asistencia.id}>
                  {userType === 'manager' && (
                    <td>{obtenerNombreUsuario(asistencia.userId)}</td>
                  )}
                  <td>{asistencia.fecha}</td>
                  <td>{asistencia.hora}</td>
                  <td>
                    <span className={`estado ${asistencia.estado}`}>
                      {asistencia.estado}
                    </span>
                  </td>
                  {userType === 'manager' && (
                    <td>
                      <button 
                        className="btn-eliminar"
                        onClick={() => eliminarAsistencia(asistencia.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Asistencia;