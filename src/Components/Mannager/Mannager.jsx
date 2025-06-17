import React, { Component } from 'react'
import Navbar from '../Navbar/Navbar'

export class Mannager extends Component {
  render() {
    return (
      <div>
        <Navbar role="manager" />
        <h1>
          PAGINA PARA ADMINISTRADOR 
        </h1>
      </div>
    )
  }
}

export default Mannager