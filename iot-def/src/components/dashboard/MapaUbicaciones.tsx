"use client"

import { useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import type { Parcela } from "../../types"
import "mapbox-gl/dist/mapbox-gl.css"
import "../../styles/Dashboard.css"

// Configurar token de Mapbox
mapboxgl.accessToken = "pk.eyJ1IjoiZGF2aWRzaXN4IiwiYSI6ImNtNGdoNjkzMzFsODgyaXBzbXQxdHdjdXcifQ.cbBB4nPaDF9XmhdD-Hdolw"

interface MapaUbicacionesProps {
  parcelas: Parcela[]
}

function MapaUbicaciones({ parcelas }: MapaUbicacionesProps) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (parcelas.length === 0) return

    const mapContainer = document.getElementById("mapa-ubicaciones")
    if (!mapContainer) return

    // Inicializar mapa
    const newMap = new mapboxgl.Map({
      container: "mapa-ubicaciones",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [parcelas[0].longitud, parcelas[0].latitud],
      zoom: 13,
    })

    // Agregar controles de navegación
    newMap.addControl(new mapboxgl.NavigationControl())

    // Agregar marcadores cuando el mapa se cargue
    newMap.on("load", () => {
      parcelas.forEach((parcela) => {
        // Crear elemento HTML para el popup
        const popupContent = document.createElement("div")
        popupContent.className = "popup-content"
        popupContent.innerHTML = `
          <h3>${parcela.nombre}</h3>
          <p>Temperatura: ${parcela.temperatura}°C</p>
          <p>Humedad: ${parcela.humedad}%</p>
          <p>Lluvia: ${parcela.lluvia ? "Sí" : "No"}</p>
          <a href="/parcela/${parcela.id}" class="popup-link">Ver detalles</a>
        `

        // Crear marcador con popup
        const marker = new mapboxgl.Marker({ color: "#2d3e34" })
          .setLngLat([parcela.longitud, parcela.latitud])
          .setPopup(new mapboxgl.Popup().setDOMContent(popupContent))
          .addTo(newMap)
      })
    })

    setMap(newMap)

    // Limpiar al desmontar
    return () => {
      newMap.remove()
    }
  }, [parcelas])

  return <div id="mapa-ubicaciones" className="map-container"></div>
}

export default MapaUbicaciones

