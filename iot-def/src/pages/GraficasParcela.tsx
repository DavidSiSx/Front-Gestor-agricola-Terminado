"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import { ArrowLeft } from "lucide-react"
import { fetchParcelaById, fetchHistorialParcela } from "../services/api"
import type { Parcela, HistorialItem } from "../types"
import "../styles/GraficasParcela.css"

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Función para formatear fecha y hora
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
}

// Función para agrupar datos por intervalos de tiempo
const groupDataByTimeInterval = (data: HistorialItem[], intervalMinutes = 30) => {
  const grouped: Record<
    string,
    {
      temperatura: number[]
      humedad: number[]
      lluvia: number[]
      intensidadSol: number[]
      count: number
      timestamp: number
    }
  > = {}

  // Ordenar datos por fecha
  const sortedData = [...data].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

  sortedData.forEach((item) => {
    const date = new Date(item.fecha)
    // Redondear al intervalo más cercano
    const minutes = date.getMinutes()
    const roundedMinutes = Math.floor(minutes / intervalMinutes) * intervalMinutes
    date.setMinutes(roundedMinutes, 0, 0)

    const timeKey = date.toISOString()
    const timestamp = date.getTime()

    if (!grouped[timeKey]) {
      grouped[timeKey] = {
        temperatura: [],
        humedad: [],
        lluvia: [],
        intensidadSol: [],
        count: 0,
        timestamp,
      }
    }

    grouped[timeKey].temperatura.push(item.temperatura)
    grouped[timeKey].humedad.push(item.humedad)
    grouped[timeKey].lluvia.push(item.lluvia)
    grouped[timeKey].intensidadSol.push(item.intensidadSol)
    grouped[timeKey].count++
  })

  return grouped
}

function GraficasParcela() {
  const { id } = useParams<{ id: string }>()
  const [parcela, setParcela] = useState<Parcela | null>(null)
  const [historial, setHistorial] = useState<HistorialItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 días atrás
    end: new Date().toISOString().split("T")[0], // Hoy
  })
  const [timeInterval, setTimeInterval] = useState<number>(30) // Intervalo en minutos

  useEffect(() => {
    const loadData = async () => {
      if (!id) return

      try {
        setLoading(true)
        const parcelaData = await fetchParcelaById(id)
        setParcela(parcelaData)

        const historialData = await fetchHistorialParcela(id)
        setHistorial(historialData)
      } catch (err) {
        console.error("Error al cargar datos:", err)
        setError("Error al cargar los datos. Por favor, intenta de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  // Filtrar historial por rango de fechas
  const filteredHistorial = historial.filter((item) => {
    const itemDate = new Date(item.fecha)
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)
    endDate.setHours(23, 59, 59) // Incluir todo el día final

    return itemDate >= startDate && itemDate <= endDate
  })

  // Agrupar datos por intervalo de tiempo
  const groupedByTime = groupDataByTimeInterval(filteredHistorial, timeInterval)

  // Ordenar las claves por timestamp
  const timeKeys = Object.keys(groupedByTime).sort((a, b) => groupedByTime[a].timestamp - groupedByTime[b].timestamp)

  // Preparar datos para las gráficas
  const labels = timeKeys.map((key) => formatDateTime(key))

  const temperaturaData = timeKeys.map((key) => {
    const sum = groupedByTime[key].temperatura.reduce((a, b) => a + b, 0)
    return Math.round((sum / groupedByTime[key].count) * 10) / 10 // Redondear a 1 decimal
  })

  const humedadData = timeKeys.map((key) => {
    const sum = groupedByTime[key].humedad.reduce((a, b) => a + b, 0)
    return Math.round((sum / groupedByTime[key].count) * 10) / 10 // Redondear a 1 decimal
  })

  // Configuración de gráficas
  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: parcela ? `Datos históricos - ${parcela.nombre}` : "Datos históricos",
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            return context[0].label
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => value,
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 20,
        },
      },
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 5,
      },
      line: {
        tension: 0.2,
      },
    },
  }

  const temperaturaChartData = {
    labels,
    datasets: [
      {
        label: "Temperatura (°C)",
        data: temperaturaData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.2,
      },
    ],
  }

  const humedadChartData = {
    labels,
    datasets: [
      {
        label: "Humedad (%)",
        data: humedadData,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        tension: 0.2,
      },
    ],
  }

  if (loading) {
    return <div className="loading">Cargando datos...</div>
  }

  if (error || !parcela) {
    return <div className="error">{error || "Parcela no encontrada"}</div>
  }

  return (
    <div className="graficas-parcela">
      <div className="graficas-header">
        <Link to={`/parcela/${id}`} className="back-link">
          <ArrowLeft size={20} />
          <span>Volver a la parcela</span>
        </Link>
        <h1>Gráficas - {parcela.nombre}</h1>
      </div>

      <div className="filtros">
        <div className="filtro-fecha">
          <label htmlFor="fecha-inicio">Desde:</label>
          <input
            type="date"
            id="fecha-inicio"
            value={dateRange.start}
            onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
          />

          <label htmlFor="fecha-fin">Hasta:</label>
          <input
            type="date"
            id="fecha-fin"
            value={dateRange.end}
            onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
          />
        </div>

        <div className="filtro-intervalo">
          <label htmlFor="intervalo-select">Intervalo:</label>
          <select id="intervalo-select" value={timeInterval} onChange={(e) => setTimeInterval(Number(e.target.value))}>
            <option value="15">15 minutos</option>
            <option value="30">30 minutos</option>
            <option value="60">1 hora</option>
            <option value="120">2 horas</option>
            <option value="360">6 horas</option>
            <option value="720">12 horas</option>
            <option value="1440">24 horas</option>
          </select>
        </div>
      </div>

      {filteredHistorial.length > 0 ? (
        <div className="graficas-container">
          <div className="grafica">
            <h2>Temperatura</h2>
            <div className="chart-container">
              <Line options={chartOptions} data={temperaturaChartData} />
            </div>
          </div>

          <div className="grafica">
            <h2>Humedad</h2>
            <div className="chart-container">
              <Line options={chartOptions} data={humedadChartData} />
            </div>
          </div>
        </div>
      ) : (
        <div className="no-data">No hay datos disponibles para los filtros seleccionados</div>
      )}

      <div className="historial-completo">
        <h2>Historial Completo</h2>

        {filteredHistorial.length > 0 ? (
          <div className="historial-table-container">
            <table className="historial-table">
              <thead>
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Temperatura</th>
                  <th>Humedad</th>
                  <th>Lluvia</th>
                  <th>Intensidad Sol</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistorial.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {new Date(item.fecha).toLocaleDateString()} {new Date(item.fecha).toLocaleTimeString()}
                    </td>
                    <td>{item.temperatura}°C</td>
                    <td>{item.humedad}%</td>
                    <td>
                      {item.lluvia} mm {item.lluvia > 5 ? "(Lluvia)" : "(Sin lluvia)"}
                    </td>
                    <td>UV: {item.intensidadSol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">No hay datos disponibles para los filtros seleccionados</div>
        )}
      </div>
    </div>
  )
}

export default GraficasParcela

