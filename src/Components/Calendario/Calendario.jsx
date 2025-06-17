import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert } from "react-bootstrap";

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const horasBloque = [
    "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00"
];

const obtenerHoraInicio = (horario) => {
    if (!horario) return "";
    return horario.split(" - ")[0];
};

const CalendarioSemanal = () => {
    const [rutinas, setRutinas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRutinas = async () => {
            try {
                const response = await fetch('https://6840f643d48516d1d359d997.mockapi.io/clases');
                if (!response.ok) throw new Error("Error al cargar las rutinas");
                const data = await response.json();
                setRutinas(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRutinas();
    }, []);

    const obtenerRutina = (dia, hora) => {
        return rutinas.find(r => {
            const horaRutina = obtenerHoraInicio(r.Horario);
            return r.Dia === dia && horaRutina === hora;
        });
    };

    if (loading) {
        return (
            <Container fluid className="text-center py-5 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <Spinner animation="border" />
                <p className="mt-3">Cargando calendario...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container fluid className="py-5 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <Alert variant="danger">
                    <Alert.Heading>Error al cargar datos</Alert.Heading>
                    <p>{error}</p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4 d-flex flex-column" style={{ minHeight: "100vh" }}>
            <h3 className="mb-4 text-center">Calendario Semanal</h3>
            <div className="table-responsive flex-grow-1" style={{ height: "100%" }}>
                <Table bordered hover className="w-100 text-center align-middle h-100 m-0" style={{ tableLayout: "fixed" }}>
                    <thead className="table-primary">
                        <tr>
                            <th style={{ minWidth: '80px' }}>Hora</th>
                            {diasSemana.map(dia => (
                                <th key={dia}>{dia}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {horasBloque.map(hora => (
                            <tr key={hora} style={{ height: `${100 / horasBloque.length}%` }}>
                                <td className="fw-bold">{hora}</td>
                                {diasSemana.map(dia => {
                                    const rutina = obtenerRutina(dia, hora);
                                    return (
                                        <td key={`${dia}-${hora}`}>
                                            {rutina ? (
                                                <>
                                                    <strong>{rutina.Nombre}</strong>
                                                    <div className="text-muted" style={{ fontSize: '0.8em' }}>{rutina.Rutina}</div>
                                                </>
                                            ) : ""}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default CalendarioSemanal;
