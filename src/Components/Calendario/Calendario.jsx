import React, { useState } from "react";
import "./Calendario.css";
const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Obtiene todos los días de lunes a viernes de un mes y año dados
function getDiasLaborales(year, month) {
    const days = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
        const day = date.getDay(); // 0: domingo, 1: lunes, ..., 6: sábado
        if (day >= 1 && day <= 5) {
            days.push(new Date(date));
        }
        date.setDate(date.getDate() + 1);
    }
    return days;
}

const Calendario = () => {
    const year = new Date().getFullYear();
    const [mesActual, setMesActual] = useState(new Date().getMonth());

    const dias = getDiasLaborales(year, mesActual);

    // Agrupar los días por semana (de lunes a viernes)
    const semanas = [];
    let semana = [];
    dias.forEach((fecha, i) => {
        semana.push(fecha);
        if (semana.length === 5 || i === dias.length - 1) {
            semanas.push(semana);
            semana = [];
        }
    });

    const handlePrev = () => {
        setMesActual((prev) => (prev === 0 ? 11 : prev - 1));
    };

    const handleNext = () => {
        setMesActual((prev) => (prev === 11 ? 0 : prev + 1));
    };

    return (
        <div className="calendario-container">
            <h1 className="calendario-titulo">Calendario {year}</h1>
            <div className="calendario-controles">
                <button className="calendario-boton" onClick={handlePrev}>Anterior</button>
                <h2 className="calendario-mes">{meses[mesActual]}</h2>
                <button className="calendario-boton" onClick={handleNext}>Siguiente</button>
            </div>
            <table className="calendario-tabla">
                <thead>
                    <tr>
                        {diasSemana.map(dia => (
                            <th className="calendario-cabecera" key={dia}>{dia}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {semanas.map((sem, i) => (
                        <tr key={i}>
                            {[0, 1, 2, 3, 4].map(j => (
                                <td className="calendario-celda" key={j}>
                                    {sem[j] ? sem[j].getDate() : ""}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default Calendario;  
