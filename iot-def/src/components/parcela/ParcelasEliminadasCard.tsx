import type { ParcelaEliminada } from "../../types"
import "../../styles/ParcelasEliminadas.css"

interface ParcelasEliminadasCardProps {
  parcela: ParcelaEliminada
}

function ParcelasEliminadasCard({ parcela }: ParcelasEliminadasCardProps) {
  return (
    <div className="parcela-card">
      <div className="parcela-header">
        <h3>{parcela.nombre}</h3>
        <span className="fecha-eliminacion">
          Eliminada el: {new Date(parcela.fechaEliminacion).toLocaleDateString()}
        </span>
      </div>

      <div className="parcela-info">
        <p>Latitud: {parcela.latitud}</p>
        <p>Longitud: {parcela.longitud}</p>
        <p>Última temperatura: {parcela.ultimaTemperatura}°C</p>
        <p>Última humedad: {parcela.ultimaHumedad}%</p>
      </div>
    </div>
  )
}

export default ParcelasEliminadasCard

