"use client"

import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "../styles/Auth.css"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")

    // Validaciones
    if (!name) {
      setError("El nombre es obligatorio")
      return
    }

    if (!email) {
      setError("El correo electrónico es obligatorio")
      return
    }

    if (!password) {
      setError("La contraseña es obligatoria")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    try {
      setLoading(true)
      await register(email, password, name)
      navigate("/")
    } catch (error: any) {
      let errorMessage = "Error al registrarse"

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Ya existe una cuenta con este correo electrónico"
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Formato de correo electrónico inválido"
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña es demasiado débil"
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Crear Cuenta</h1>
        <h2>CultivosAPP-SierraSosa</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña (mínimo 6 caracteres)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
      <div className="auth-attribution">
        Imagen por{" "}
        <a href="https://www.freepik.es" target="_blank" rel="noopener noreferrer">
          Freepik
        </a>
      </div>
    </div>
  )
}

export default Register

