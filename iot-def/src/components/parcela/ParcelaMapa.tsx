"use client"

import { useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import type { Parcela } from "../../types"
import "mapbox-gl/dist/mapbox-gl.css"
import "../../styles/ParcelaDetail.css"

// Configurar token de Mapbox
mapboxgl.accessToken = "pk.eyJ1IjoiZGF2aWRzaXN4IiwiYSI6ImNtNGdoNjkzMzFsODgyaXBzbXQxdHdjdXcifQ.cbBB4nPaDF9XmhdD-Hdolw"

interface ParcelaMapaProps {
  parcela: Parcela
}

function ParcelaMapa({ parcela }: ParcelaMapaProps) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null)

  useEffect(() => {
    const mapContainer = document.getElementById(`mapa-parcela-${parcela.id}`)
    if (!mapContainer) return

    // Inicializar mapa
    const newMap = new mapboxgl.Map({
      container: `mapa-parcela-${parcela.id}`,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [Number.parseFloat(parcela.longitud), Number.parseFloat(parcela.latitud)],
      zoom: 15,
    })

    // Agregar controles de navegación
    newMap.addControl(new mapboxgl.NavigationControl())

    // Agregar marcador cuando el mapa se cargue
    newMap.on("load", () => {
      // Crear elemento HTML para el popup
      const popupContent = document.createElement("div")
      popupContent.className = "popup-content"
      popupContent.innerHTML = `
        <h3>${parcela.nombre}</h3>
        <p>Ubicación: ${parcela.ubicacion}</p>
        <p>Responsable: ${parcela.responsable}</p>
        <p>Cultivo: ${parcela.tipo_cultivo}</p>
        <p>Último riego: ${new Date(parcela.ultimo_riego).toLocaleString()}</p>
      `

      // Crear marcador con popup
      const marker = new mapboxgl.Marker({ color: "#2d3e34" })
        .setLngLat([Number.parseFloat(parcela.longitud), Number.parseFloat(parcela.latitud)])
        .setPopup(new mapboxgl.Popup().setDOMContent(popupContent))
        .addTo(newMap)
    })

    setMap(newMap)

    // Limpiar al desmontar
    return () => {
      newMap.remove()
    }
  }, [parcela])

  return <div id={`mapa-parcela-${parcela.id}`} className="parcela-map"></div>
}

export default ParcelaMapa

