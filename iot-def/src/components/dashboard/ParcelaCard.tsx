import { Link } from "react-router-dom"
import { Thermometer, Droplets, Cloud, Sun } from "lucide-react"
import type { Parcela } from "../../types"
import "../../styles/Dashboard.css"

interface ParcelaCardProps {
  parcela: Parcela
}

function ParcelaCard({ parcela }: ParcelaCardProps) {
  // Obtener los valores de temperatura y humedad
  const temperatura = parcela.temperatura || 0
  const humedad = parcela.humedad || 0

  // Para lluvia, mostrar el valor numérico
  const lluviaValor = typeof parcela.lluvia === "boolean" ? (parcela.lluvia ? 10 : 0) : parcela.lluvia || 0

  // Para intensidad del sol, mostrar el valor numérico
  const intensidadSol = parcela.intensidadSol || 0

  return (
    <Link to={`/parcela/${parcela.id}`} className="parcela-card">
      <h3>{parcela.nombre}</h3>
      <div className="parcela-info">
        <p>
          <Thermometer size={16} /> {temperatura}°C
        </p>
        <p>
          <Droplets size={16} /> {humedad}%
        </p>
        <p>
          <Cloud size={16} /> {lluviaValor} mm {lluviaValor > 5 ? "(Lluvia)" : "(Sin lluvia)"}
        </p>
        <p>
          <Sun size={16} /> UV: {intensidadSol}
        </p>
      </div>
    </Link>
  )
}

export default ParcelaCard

