import React, { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Calendario from '../Calendario/Calendario'

function User() {
  const [view, setView] = useState('calendario')

  // Suponiendo que Navbar acepta una prop onNavClick
  return (
    <div>
      <Navbar role="user" onNavClick={setView} />
      {view === 'calendario' && <Calendario />}
      {/* Puedes agregar más vistas aquí según sea necesario */}
    </div>
  )
}

export default User